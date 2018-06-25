use diesel;
use diesel::prelude::*;
use model::deck::*;
use rocket::State;
use rocket_contrib::Json;
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
    type_: NewDeckType,
}

#[post("/deck", format = "application/json", data = "<deck_json>")]
fn new_deck(
    deck_json: Json<NewDeckRequest>,
    user_guard: Result<UserGuard, ApiError>,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<Deck>, ApiError> {
    let user = user_guard?.0;
    let pile = match deck_json.type_ {
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
