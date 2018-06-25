use rocket::response::NamedFile;
use rocket::State;
use std::path::PathBuf;

#[derive(Debug)]
pub struct StaticFileConfig {
    pub root_path: PathBuf,
}

#[get("/<file..>")]
pub fn static_file(config: State<StaticFileConfig>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(config.root_path.join(file)).ok()
}
