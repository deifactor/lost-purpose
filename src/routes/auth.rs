use diesel;
use diesel::prelude::*;
use model::auth::User;
use rocket::http::{Cookie, Cookies, Status};
use rocket::request::{self, FromRequest, Request};
use rocket::{Outcome, State};
use rocket_contrib::Json;
use routes::{ApiError, HasStatus};
use schema::users;
use std::fmt::{self, Debug};
use std::num;
use std::sync::Mutex;

/// Guards that there must be an `id` cookie with a valid user ID. Note that for
/// API calls, you'll want to add a parameter of type `Result<UserGuard,
/// ApiError>` and immediately invoke the `?` operator on it to ensure that
/// failure will send JSON back and not just fall back to the default Rocket
/// handlers.
#[derive(Debug)]
pub struct UserGuard(pub User);

#[derive(Debug, PartialEq, Eq, Fail)]
pub enum UserGuardError {
    /// No user cookie was set.
    #[fail(display = "no user cookie set")]
    NoUserCookie,

    /// The cookie was set, but could not be parsed. This should never happen
    /// unless there was an internal bug.
    #[fail(display = "user cookie could not be parsed: {}", err)]
    UserCookieParseError { err: num::ParseIntError },

    /// We couldn't look up the user.
    #[fail(display = "user {} not found", id)]
    UserNotFound { id: i32 },

    /// Something else went wrong.
    #[fail(display = "unknown error")]
    InternalError,
}

impl HasStatus for UserGuardError {
    fn status(&self) -> Status {
        match self {
            UserGuardError::InternalError => Status::InternalServerError,
            _ => Status::BadRequest,
        }
    }
}

impl<'a, 'r> FromRequest<'a, 'r> for UserGuard {
    type Error = ApiError;

    fn from_request(request: &'a Request<'r>) -> request::Outcome<UserGuard, ApiError> {
        // We implement things using this slightly weird approach (including
        // defining our own error struct) to ensure consistency between the
        // status codes you get if you request a `UserGuard` and the status codes
        // contained in the `ApiError` if you request a `Result<UserGuard,
        // ApiError>`.
        let inner = || -> Result<User, UserGuardError> {
            use self::UserGuardError::*;
            let mut cookies = request.cookies();
            let id_cookie = cookies.get_private("id").ok_or(NoUserCookie)?;
            let user_id: i32 = id_cookie
                .value()
                .parse()
                .map_err(|err| UserCookieParseError { err })?;
            let conn_guard = request
                .guard::<State<Mutex<PgConnection>>>()
                .success_or_else(|| InternalError)?;
            let conn = conn_guard.lock().expect("connection lock poisoned");
            match users::table
                .find(user_id)
                .first(&*conn)
                .optional()
                .map_err(|_| InternalError)?
            {
                Some(user) => Ok(user),
                None => Err(UserNotFound { id: user_id }),
            }
        };
        match inner() {
            Ok(user) => Outcome::Success(UserGuard(user)),
            Err(err) => Outcome::Failure((err.status(), err.into())),
        }
    }
}

#[derive(Deserialize)]
pub struct LoginRequest {
    id: i32,
}

// Manual Debug implementation so we don't leak passwords.
impl Debug for LoginRequest {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "LoginRequest {{ id: {:?} }}", &self.id)
    }
}

/// Attempts to log in. 404s if the user does not exist; 403s if the password is
/// incorrect. If successful, sets a login cookie and replies with the ID of the
/// logged-in user.
#[post("/login", data = "<login_json>")]
pub fn login(
    login_json: Option<Json<LoginRequest>>,
    conn_guard: State<Mutex<PgConnection>>,
    mut cookies: Cookies,
) -> Result<Json<i32>, ApiError> {
    let login_request = login_json
        .ok_or_else(|| ApiError::new(Status::BadRequest, Json(json!("invalid login request"))))?;
    // XXX: implement actual password authentication
    let conn = conn_guard.lock().expect("connection lock poisoned");
    if let Some(user) = users::table
        .find(login_request.id)
        .get_result::<User>(&*conn)
        .optional()?
    {
        cookies.add_private(Cookie::new("id", user.id.to_string()));
        Ok(Json(user.id))
    } else {
        Err(ApiError::new(
            Status::BadRequest,
            Json(json!(format!("unknown user id {}", login_request.id))),
        ))
    }
}

#[derive(Deserialize)]
pub struct RegisterRequest {}

/// Registers a new user. Replies with the new user's ID.
#[post("/register", data = "<request_json>")]
pub fn register(
    request_json: Option<Json<RegisterRequest>>,
    conn_guard: State<Mutex<PgConnection>>,
    mut cookies: Cookies,
) -> Result<Json<i32>, ApiError> {
    let _register_request = request_json
        .ok_or_else(|| ApiError::new(Status::BadRequest, Json(json!("invalid register request"))))?;
    let conn = conn_guard.lock().expect("connection lock poisoned");
    let user: User = diesel::insert_into(users::table)
        .default_values()
        .get_result(&*conn)?;
    cookies.add_private(Cookie::new("id", user.id.to_string()));
    Ok(Json(user.id))
}

#[cfg(test)]
mod tests {
    use super::*;
    use db_test::setup_connection;
    use rocket;
    use rocket::http::ContentType;
    use rocket::local::Client;

    fn new_client() -> Client {
        let rocket = rocket::ignite()
            .manage(Mutex::new(setup_connection()))
            .mount("/", routes![login, register]);
        Client::new(rocket).expect("unable to construct client")
    }

    #[test]
    fn test_register() {
        let client = new_client();
        let mut response = client
            .post("/register")
            .header(ContentType::JSON)
            .body("{}")
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert!(response.headers().contains("Set-Cookie"));
        assert!(response.body_string().unwrap().parse::<i32>().is_ok())
    }

    fn register(client: &Client) -> i32 {
        client
            .post("/register")
            .header(ContentType::JSON)
            .body("{}")
            .dispatch()
            .body_string()
            .unwrap()
            .parse::<i32>()
            .unwrap()
    }

    #[test]
    fn multiple_registrations_return_different_ids() {
        let client = new_client();
        assert_ne!(register(&client), register(&client))
    }

    #[test]
    fn register_then_login() {
        let client = new_client();
        let id = register(&client);
        let mut response = client
            .post("/login")
            .header(ContentType::JSON)
            .body(json!({ "id": id }).to_string())
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert!(response.headers().contains("Set-Cookie"));
        assert_eq!(response.body_string().unwrap().parse::<i32>(), Ok(id));
    }

    #[test]
    fn login_nonexistent_user() {
        let client = new_client();
        let response = client
            .post("/login")
            .header(ContentType::JSON)
            .body(json!({ "id": 0xBAD }).to_string())
            .dispatch();
        assert!(!response.headers().contains("Set-Cookie"));
        assert_eq!(response.status(), Status::BadRequest);
    }
}
