/// Defines structs for all the data we store in the database.
use auth::User;
use chrono::prelude::*;
use diesel;
use diesel::prelude::*;
use pile;
use rand;
use std;

use schema::{decks, users};

#[derive(Debug, Identifiable, Associations, Queryable, PartialEq, Eq, Serialize)]
#[belongs_to(User)]
pub struct Deck {
    pub id: i32,
    pub user_id: i32,
    pub position: i32,
    pub name: String,
    pub pile: pile::Pile,
}
