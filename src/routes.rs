use false_name;
use rocket::response::NamedFile;
use rocket::State;
use rocket_contrib::{Json, Value};
use std::path::{Path, PathBuf};

#[derive(Debug)]
pub struct StaticFileConfig {
    pub root_path: PathBuf,
}

#[get("/false_name/<id>")]
fn get_false_name(id: u64) -> String {
    false_name::to_false_name(id)
}

#[get("/id/<false_name>")]
fn get_id(false_name: String) -> Json<Value> {
    match false_name::from_false_name(&false_name) {
        Ok(id) => Json(json!(id)),
        Err(e) => Json(json!(format!("{}", e))),
    }
}

#[get("/<file..>")]
fn get_file(config: State<StaticFileConfig>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(config.root_path.join(file)).ok()
}
