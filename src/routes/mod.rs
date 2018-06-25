/// Handlers for all of the API calls defined for Skarot.
///
/// We use a convention where success is defined by returning a JSON object (or
/// a number or string, which technically isn't valid JSON at the top level) and
/// a 2xx error code. Failure is indicated by returning a JSON object with an
/// `err` property containing user-interpretable text and a `debug` property
/// containing the original object, as well as a non-2xx error code.
use diesel;
use rocket::http::Status;
use rocket::request::Request;
use rocket::response::{status, Responder, Response};
use rocket_contrib::Json;

pub mod auth;
pub mod deck;
pub mod static_file;

/// The uniform error type that all of the JSON API calls return. We define this
/// as a newtype so that we can implement `Into` for it.
#[derive(Debug)]
pub struct ApiError(status::Custom<Json>);

impl ApiError {
    pub fn new(status: Status, payload: Json) -> ApiError {
        ApiError(status::Custom(status, payload))
    }
}

impl From<diesel::result::Error> for ApiError {
    fn from(err: diesel::result::Error) -> Self {
        ApiError::new(
            Status::InternalServerError,
            Json(json!(format!("database error: {}", &err))),
        )
    }
}

impl<'r> Responder<'r> for ApiError {
    fn respond_to(self, request: &Request) -> Result<Response<'r>, Status> {
        self.0.respond_to(request)
    }
}
