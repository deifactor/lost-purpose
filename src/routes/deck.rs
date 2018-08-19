use diesel;
use diesel::prelude::*;
use model::deck::*;
use rocket::State;
use rocket_contrib::{Json, SerdeError};
use routes::auth::UserGuard;
use routes::ApiError;
use schema::decks;
use std::sync::Mutex;

#[get("/deck")]
fn get_decks(
    user_guard: Result<UserGuard, ApiError>,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<Vec<Deck>>, ApiError> {
    let user = user_guard?.0;
    let conn = conn_guard.lock()?;
    let decks = Deck::belonging_to(&user).load(&*conn)?;
    Ok(Json(decks))
}

#[derive(Debug, PartialEq, Eq, Deserialize)]
enum NewDeckType {
    Standard,
    SiliconDawn,
}

#[derive(Debug, Deserialize)]
struct NewDeckRequest {
    name: String,
    #[serde(rename = "type")]
    type_: NewDeckType,
}

#[post("/deck", format = "application/json", data = "<request>")]
fn new_deck(
    request: Result<Json<NewDeckRequest>, SerdeError>,
    user_guard: Result<UserGuard, ApiError>,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<Deck>, ApiError> {
    let user = user_guard?.0;
    let request = request?;
    let pile = match request.type_ {
        NewDeckType::Standard => Pile::standard(),
        NewDeckType::SiliconDawn => Pile::silicon_dawn(),
    };
    let conn = conn_guard.lock()?;
    let position = Deck::belonging_to(&user)
        .select(diesel::dsl::max(decks::position))
        .first::<Option<i32>>(&*conn)?
        .map(|pos| pos + 1)
        .unwrap_or(0);
    diesel::insert_into(decks::table)
        .values((
            decks::user_id.eq(user.id),
            decks::position.eq(position),
            decks::name.eq(&request.name),
            decks::pile.eq(pile),
        ))
        .execute(&*conn)?;
    let deck = decks::table
        .filter(decks::user_id.eq(user.id))
        .filter(decks::position.eq(position))
        .first(&*conn)?;
    Ok(Json(deck))
}

#[cfg(test)]
mod tests {
    use super::*;
    use db_test::setup_connection;
    use rocket;
    use routes::auth;
    use rocket::http::{ContentType, Cookie, Status};
    use rocket::local::Client;
    use routes::test_utils::*;
    use serde_json;

    fn new_client() -> Client {
        let rocket = rocket::ignite()
            .manage(Mutex::new(setup_connection()))
            .mount("/", routes![get_decks, new_deck, auth::register]);
        Client::new(rocket).expect("unable to construct client")
    }

    #[test]
    fn no_decks() {
        let client = new_client();
        let id = register(&client);
        let body = client
            .get("/deck")
            .private_cookie(Cookie::new("id", id.to_string()))
            .dispatch()
            .body_string()
            .unwrap();
        let decks: Vec<Deck> = serde_json::from_str(&body).unwrap();
        assert!(decks.is_empty())
    }

    #[test]
    fn single_deck() {
        let client = new_client();
        let user_id = register(&client);
        let auth_cookie = Cookie::new("id", user_id.to_string());
        let response = client
            .post("/deck")
            .header(ContentType::JSON)
            .body(json!({"name": "foo", "type": "SiliconDawn"}).to_string())
            .private_cookie(auth_cookie.clone())
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
        let body = client
            .get("/deck")
            .private_cookie(auth_cookie.clone())
            .dispatch()
            .body_string()
            .unwrap();
        let decks: Vec<Deck> = serde_json::from_str(&body).unwrap();
        assert_eq!(decks.len(), 1);
        let deck = &decks[0];
        assert_eq!(deck.name, "foo");
        assert_eq!(deck.position, 0);
        assert_eq!(deck.user_id, user_id);
        assert_eq!(deck.pile.cards.len(), 94)
    }
}
