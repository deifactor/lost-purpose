#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate byteorder;
extern crate chrono;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate failure;
#[macro_use]
extern crate itertools;
extern crate rand;
extern crate rand_core;
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate structopt;

mod db_test;
mod lfsr;
mod model;
mod routes;
mod schema;

use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(name = "skarot")]
struct Opt {
    /// Path to the directory containing the static files.
    #[structopt(long = "static_dir")]
    static_dir: String,
}

fn main() {
    let opt = Opt::from_args();
    rocket::ignite()
        .manage(routes::static_file::StaticFileConfig {
            root_path: opt.static_dir.into(),
        })
        .mount("/", routes![routes::deck::get_decks, routes::deck::new_deck])
        .mount("/auth", routes![routes::auth::login, routes::auth::register])
        .mount("/static", routes![routes::static_file::static_file])
        .launch();
}
