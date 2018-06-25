/// Utilities to help build routes.
use diesel;
use rocket::{Request, Response};
use rocket::http::Status;
use rocket::response::{status, Responder};
use rocket_contrib::Json;

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
