/// Defines structs for all the data we store in the database.
use chrono::prelude::*;
use diesel;
use diesel::prelude::*;
use pile;
use rand;
use std;

/// All kinds of errors that can be returned from a database API call, including
/// both database errors and application-logic errors.
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
    InsertNewUserAttemptExhaustedError,
}

impl From<diesel::result::Error> for DatabaseError {
    fn from(error: diesel::result::Error) -> Self {
        DatabaseError::InternalError { error }
    }
}

type Result<T> = std::result::Result<T, DatabaseError>;

use schema::{decks, users};

#[derive(Debug, Identifiable, Queryable, PartialEq, Eq)]
pub struct User {
    pub id: i64,
    created_at: NaiveDateTime,
}

const NEW_USER_ATTEMPTS: u64 = 1_000;

impl User {
    pub fn insert_new_user(conn: &SqliteConnection) -> Result<User> {
        Self::insert_new_user_with_rng(conn, &mut rand::thread_rng())
    }

    fn insert_new_user_with_rng<R: rand::Rng + ?Sized>(
        conn: &SqliteConnection,
        rng: &mut R,
    ) -> Result<User> {
        use schema::users::dsl::*;
        for _ in 0..NEW_USER_ATTEMPTS {
            let new_id = rng.gen::<i64>();
            let count: i64 = users.find(new_id).count().get_result(conn)?;
            if count != 0 {
                continue;
            }
            // TODO: Set up a cron job sort of thing that deletes all users that
            // are over a week old and don't have decks.
            diesel::insert_into(users)
                .values(id.eq(new_id))
                .execute(conn)?;
            return users.find(new_id).first(conn).map_err(|e| e.into());
        }
        Err(DatabaseError::InsertNewUserAttemptExhaustedError)
    }
}

#[derive(Debug, Identifiable, Associations, Queryable, PartialEq, Eq, Serialize)]
#[belongs_to(User)]
pub struct Deck {
    pub id: i32,
    pub user_id: i64,
    pub position: i32,
    pub name: String,
    pub pile: pile::Pile,
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::rngs::mock::StepRng;

    embed_migrations!("migrations");

    fn setup_connection() -> SqliteConnection {
        let conn = SqliteConnection::establish(":memory:")
            .expect("Could not connect to in-memory SQLite database");
        embedded_migrations::run(&conn).expect("Failed to run embedded migrations");
        conn
    }

    mod get_new_user {
        use super::*;
        #[test]
        fn with_empty_database() {
            assert!(User::insert_new_user(&setup_connection()).is_ok())
        }

        #[test]
        fn doesnt_collide() {
            let conn = setup_connection();
            let mut rng = StepRng::new(0, 1);
            assert_eq!(
                User::insert_new_user_with_rng(&conn, &mut rng).unwrap().id,
                0
            );
            assert_eq!(
                User::insert_new_user_with_rng(&conn, &mut rng).unwrap().id,
                1
            );
        }

        #[test]
        fn doesnt_infinite_loop() {
            let conn = setup_connection();
            let mut rng = StepRng::new(10, 0);
            assert_eq!(
                User::insert_new_user_with_rng(&conn, &mut rng).unwrap().id,
                10
            );
            assert_eq!(
                User::insert_new_user_with_rng(&conn, &mut rng),
                Err(DatabaseError::InsertNewUserAttemptExhaustedError)
            );
        }
    }
}
