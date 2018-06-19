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
#[macro_use]
extern crate lazy_static;
extern crate rand;
extern crate rand_core;
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate structopt;

mod card;
mod db;
mod false_name;
mod lfsr;
mod pile;
mod routes;
mod schema;

use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(name = "skarot")]
struct Opt {
    /// Path to the directory containing the static files.
    #[structopt(long = "static_dir")]
    static_dir: String
}

fn main() {
    let opt = Opt::from_args();
    rocket::ignite()
        .manage(routes::StaticFileConfig { root_path: opt.static_dir.into() })
        .mount("/", routes![routes::get_false_name, routes::get_id])
        .mount("/static", routes![routes::get_file])
        .launch();
}
