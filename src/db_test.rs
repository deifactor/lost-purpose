/// Utility functions for writing tests that talk to the database.
///
/// From a test-writer perspective, the only thing you should need to do here is
/// call setup_connection() to get the `PgConnection`.
use diesel::prelude::*;
use std::env;
use std::sync::{Once, ONCE_INIT};

embed_migrations!("migrations");

static MIGRATE: Once = ONCE_INIT;

/// Connects to the database given by the `DATABASE_TEST_URL` environment
/// variable, running migrations if necessary. This function is thread-safe;
/// migrations are run exactly once, and each connection has its own
/// transaction, which will never be committed.
#[allow(dead_code)]
pub fn setup_connection() -> PgConnection {
    let url = env::var("DATABASE_TEST_URL").expect("DATABASE_TEST_URL must be set to run tests");
    let conn = PgConnection::establish(&url).expect(&format!("Could not connect to {:?}", url));
    // We should migrate exactly once, otherwise we'll try to do it from
    // multiple threads at once and have a bad time.
    MIGRATE
        .call_once(|| embedded_migrations::run(&conn).expect("Failed to run embedded migrations"));
    conn.begin_test_transaction()
        .expect("Failed to initiate test transaction");
    conn
}
