use chrono::prelude::*;
use schema::users;

#[derive(Debug, Identifiable, Queryable, PartialEq, Eq)]
pub struct User {
    pub id: i32,
    created_at: DateTime<Utc>,
}
