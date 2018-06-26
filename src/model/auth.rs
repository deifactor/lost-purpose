use chrono::prelude::*;
use schema::users;

#[derive(Debug, Identifiable, Queryable, PartialEq, Eq)]
pub struct User {
    pub id: i32,
    pub email: String,
    created_at: DateTime<Utc>,
}
