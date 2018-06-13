/// Handlers for all of the API calls defined for Skarot.
///
/// We use a convention where success is defined by returning a JSON object (or
/// a number or string, which technically isn't valid JSON at the top level) and
/// a 2xx error code. Failure is indicated by returning a JSON object with an
/// `err` property containing user-readable text and a `debug` property
/// containing the original object, as well as a non-2xx error code.
use false_name;
use rocket::http::Status;
use rocket::response::{status, NamedFile, Responder};
use rocket::State;
use rocket_contrib::Json;
use std::fmt::{Debug, Display};
use std::path::PathBuf;

trait ToStatus {
    fn to_status(&self) -> Status;
}

impl ToStatus for false_name::FalseNameError {
    fn to_status(&self) -> Status {
        Status::BadRequest
    }
}

fn prepare<T, E: ToStatus + Debug + Display>(
    val: Result<T, E>,
) -> Result<Json<T>, status::Custom<Json>> {
    val.map(Json).map_err(|e| {
        status::Custom(
            e.to_status(),
            Json(json!({
                "err": format!("{}", e),
                "debug": format!("{:?}", e)
            })),
        )
    })
}

#[derive(Debug)]
pub struct StaticFileConfig {
    pub root_path: PathBuf,
}

#[get("/false_name/<id>")]
fn get_false_name(id: u64) -> String {
    false_name::to_false_name(id)
}

#[get("/id/<false_name>")]
fn get_id(false_name: String) -> impl Responder<'static> {
    prepare(false_name::from_false_name(&false_name))
}

#[get("/<file..>")]
fn get_file(config: State<StaticFileConfig>, file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(config.root_path.join(file)).ok()
}
