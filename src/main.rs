#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate byteorder;
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

mod card;
mod deck;
mod false_name;
mod lfsr;
mod routes;

fn main() {
    rocket::ignite()
        .mount("/", routes![routes::get_false_name, routes::get_id])
        .launch();
}
