use diesel;
use diesel::prelude::*;
use model::deck::*;
use rocket::State;
use rocket_contrib::Json;
use routes::auth::UserGuard;
use routes::ApiError;
use schema::decks;
use std::sync::Mutex;

#[derive(Debug, PartialEq, Eq, Deserialize)]
enum NewDeckType {
    Standard,
    SiliconDawn,
}

#[derive(Debug, Deserialize)]
struct NewDeck {
    name: String,
    type_: NewDeckType,
}

#[get("/deck/<id>")]
fn get_deck(
    id: i32,
    user_guard: UserGuard,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<Deck>, ApiError> {
    let user = user_guard.0;
    let conn = conn_guard.lock().expect("connection lock poisoned");
    let deck = Deck::belonging_to(&user).find(id).first(&*conn)?;
    Ok(Json(deck))
}

#[post("/deck", format = "application/json", data = "<deck_json>")]
fn new_deck(
    deck_json: Json<NewDeck>,
    user_guard: UserGuard,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<Deck>, ApiError> {
    let user = user_guard.0;
    let pile = match deck_json.type_ {
        NewDeckType::Standard => Pile::standard(),
        NewDeckType::SiliconDawn => Pile::silicon_dawn(),
    };
    let conn = conn_guard.lock().expect("connection lock poisoned");
    let position = Deck::belonging_to(&user)
        .select(diesel::dsl::max(decks::position))
        .first::<Option<i32>>(&*conn)?
        .map(|pos| pos + 1)
        .unwrap_or(0);
    diesel::insert_into(decks::table)
        .values((
            decks::user_id.eq(user.id),
            decks::position.eq(position),
            decks::name.eq(&deck_json.name),
            decks::pile.eq(pile),
        ))
        .execute(&*conn)?;
    let deck = decks::table
        .filter(decks::user_id.eq(user.id))
        .filter(decks::position.eq(position))
        .first(&*conn)?;
    Ok(Json(deck))
}
