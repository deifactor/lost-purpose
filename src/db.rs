/// A wrapper around the database where Skarot stores all of its data.
///
/// The `Database` struct and all of its methods are really just thin wrappers
/// around SQL queries to the database. Think of it as a very very simple ORM.
use chrono::prelude::*;
use diesel;
use diesel::prelude::*;
use pile;
use rand;
use std;

/// A database.
pub struct Database {
    conn: diesel::sqlite::SqliteConnection,
}

#[derive(Debug, Queryable, PartialEq, Eq)]
pub struct User {
    pub id: i64,
    created_at: NaiveDateTime
}

#[derive(Debug, Queryable, PartialEq, Eq)]
pub struct Deck {
    id: u32,
    user_id: i64,
    position: u32,
    name: String,
    pile: pile::Pile
}

/// All kinds of errors that can be returned from a database API call.
#[derive(Debug, Fail, PartialEq)]
pub enum DatabaseError {
    /// Something went wrong when talking to the database. This means
    /// something's *really* weird.
    #[fail(display = "error while talking to database: {}", error)]
    InternalError { error: diesel::result::Error },

    /// When trying to create a new ID, all of our attempts resulted in IDs that
    /// already existed. This means that more than 1/`NEW_ID_ATTEMPTS` of the
    /// IDs are taken, which means either this got *massively* popular or
    /// something's wrong.
    #[fail(display = "could not find an unused ID")]
    GetNewUserAttemptExhaustedError,
}

impl From<diesel::result::Error> for DatabaseError {
    fn from(error: diesel::result::Error) -> Self {
        DatabaseError::InternalError { error }
    }
}

type Result<T> = std::result::Result<T, DatabaseError>;

const NEW_ID_ATTEMPTS: u64 = 1_000;

impl Database {
    pub fn new(conn: diesel::SqliteConnection) -> Database {
        Database { conn }
    }

    pub fn get_new_user(&self) -> Result<User> {
        self.get_new_user_with_rng(&mut rand::thread_rng())
    }

    fn get_new_user_with_rng<R: rand::Rng + ?Sized>(&self, rng: &mut R) -> Result<User> {
        use schema::users::dsl::*;
        for _ in 0..NEW_ID_ATTEMPTS {
            let new_id = rng.gen::<i64>();
            let count: i64 = users.find(new_id).count().get_result(&self.conn)?;
            if count != 0 {
                continue;
            }
            // TODO: Set up a cron job sort of thing that deletes all users that
            // are over a week old and don't have decks.
            diesel::insert_into(users)
                .values(id.eq(new_id))
                .execute(&self.conn)?;
            return users.find(new_id).first(&self.conn).map_err(|e| e.into())
        }
        Err(DatabaseError::GetNewUserAttemptExhaustedError)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::rngs::mock::StepRng;

    embed_migrations!("migrations");

    fn setup_database() -> Database {
        let conn = SqliteConnection::establish(":memory:")
            .expect("Could not connect to in-memory SQLite database");
        embedded_migrations::run(&conn).expect("Failed to run embedded migrations");
        Database::new(conn)
    }

    mod get_new_user {
        use super::*;
        #[test]
        fn with_empty_database() {
            assert!(setup_database().get_new_user().is_ok())
        }

        #[test]
        fn doesnt_collide() {
            let db = setup_database();
            let mut rng = StepRng::new(0, 1);
            assert_eq!(db.get_new_user_with_rng(&mut rng).unwrap().id, 0);
            assert_eq!(db.get_new_user_with_rng(&mut rng).unwrap().id, 1);
        }

        #[test]
        fn doesnt_infinite_loop() {
            let db = setup_database();
            let mut rng = StepRng::new(10, 0);
            assert_eq!(db.get_new_user_with_rng(&mut rng).unwrap().id, 10);
            assert_eq!(
                db.get_new_user_with_rng(&mut rng),
                Err(DatabaseError::GetNewUserAttemptExhaustedError)
            );
        }
    }
}
