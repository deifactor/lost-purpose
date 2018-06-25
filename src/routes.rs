#![cfg_attr(feature = "cargo-clippy", allow(needless_pass_by_value, print_literal))]
/// Handlers for all of the API calls defined for Skarot.
///
/// We use a convention where success is defined by returning a JSON object (or
/// a number or string, which technically isn't valid JSON at the top level) and
/// a 2xx error code. Failure is indicated by returning a JSON object with an
/// `err` property containing user-interpretable text and a `debug` property
/// containing the original object, as well as a non-2xx error code.
use auth::UserGuard;
use diesel;
use diesel::prelude::*;
use model;
use pile;
use rocket::http::Status;
use rocket::request::{self, FromRequest, Request};
use rocket::response::{status, NamedFile};
use rocket::{Outcome, State};
use rocket_contrib::Json;
use schema::{decks, users};
use std::fmt::{Debug, Display};
use std::path::PathBuf;
use std::sync::Mutex;

trait ToStatus {
    fn to_status(&self) -> Status;

    fn to_json(&self) -> status::Custom<Json>
    where
        Self: Debug + Display,
    {
        status::Custom(
            self.to_status(),
            Json(json!({
                "err": format!("{}", self),
                "debug": format!("{:?}", self)
            })),
        )
    }
}

impl ToStatus for diesel::result::Error {
    fn to_status(&self) -> Status {
        Status::InternalServerError
    }
}

#[derive(Debug)]
pub struct StaticFileConfig {
    pub root_path: PathBuf,
}

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
) -> Result<Json<model::Deck>, status::Custom<Json>> {
    let user = user_guard.0;
    let conn = conn_guard.lock().expect("connection lock poisoned");
    model::Deck::belonging_to(&user)
        .find(id)
        .first(&*conn)
        .map_err(|e| e.to_json())
        .map(Json)
}

#[post("/deck", format = "application/json", data = "<deck_json>")]
fn new_deck(
    deck_json: Json<NewDeck>,
    user_guard: UserGuard,
    conn_guard: State<Mutex<PgConnection>>,
) -> Result<Json<model::Deck>, status::Custom<Json>> {
    let user = user_guard.0;
    let pile = match deck_json.type_ {
        NewDeckType::Standard => pile::Pile::standard(),
        NewDeckType::SiliconDawn => pile::Pile::silicon_dawn(),
    };
    let conn = conn_guard.lock().expect("connection lock poisoned");
    let position = model::Deck::belonging_to(&user)
        .select(diesel::dsl::max(decks::position))
        .first::<Option<i32>>(&*conn)
        .map_err(|e| e.to_json())?
        .map(|pos| pos + 1)
        .unwrap_or(0);
    diesel::insert_into(decks::table)
        .values((
            decks::user_id.eq(user.id),
            decks::position.eq(position),
            decks::name.eq(&deck_json.name),
            decks::pile.eq(pile),
        ))
        .execute(&*conn)
        .map_err(|e| e.to_json())?;
    decks::table
        .filter(decks::user_id.eq(user.id))
        .filter(decks::position.eq(position))
        .first(&*conn)
        .map(Json)
        .map_err(|e| e.to_json())
}

#[get("/<file..>")]
fn get_file(config: State<StaticFileConfig>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(config.root_path.join(file)).ok()
}
