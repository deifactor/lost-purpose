/// Handlers for all of the API calls defined for Lost Purpose.
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
use rocket_contrib::{Json, SerdeError};
use std;
use std::fmt::Display;

pub mod auth;
pub mod deck;
pub mod static_file;
#[cfg(test)]
mod test_utils;

/// The uniform error type that all of the JSON API calls return. We define this
/// as a newtype so that we can implement `Into` for it.
#[derive(Debug)]
pub struct ApiError(status::Custom<Json>);

/// Any internal error should implement this trait so that it can be easily and
/// uniformly converted to an ApiError.
pub trait HasStatus {
    fn status(&self) -> Status;
}

impl HasStatus for diesel::result::Error {
    fn status(&self) -> Status {
        Status::InternalServerError
    }
}

impl HasStatus for SerdeError {
    fn status(&self) -> Status {
        Status::BadRequest
    }
}

impl<T> HasStatus for std::sync::PoisonError<T> {
    fn status(&self) -> Status {
        Status::InternalServerError
    }
}

impl ApiError {
    pub fn new(status: Status, payload: Json) -> ApiError {
        ApiError(status::Custom(status, payload))
    }
}

impl<T> From<T> for ApiError
where
    T: HasStatus + Display,
{
    fn from(err: T) -> Self {
        ApiError::new(err.status(), Json(json!(err.to_string())))
    }
}

impl<'r> Responder<'r> for ApiError {
    fn respond_to(self, request: &Request) -> Result<Response<'r>, Status> {
        self.0.respond_to(request)
    }
}
