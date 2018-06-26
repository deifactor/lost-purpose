use rocket::http::{ContentType, Cookie};
use rocket::local::{Client, LocalRequest};

/// Extension-based shim for `private_cookie`. Unnecessary in 4.0 or whenever
/// https://github.com/SergioBenitez/Rocket/pull/487 gets backported to 0.3.x.
pub trait PrivateCookieExt {
    fn private_cookie(self, cookie: Cookie<'static>) -> Self;
}

impl<'a> PrivateCookieExt for LocalRequest<'a> {
    fn private_cookie(self, cookie: Cookie<'static>) -> Self {
        self.inner().cookies().add_private(cookie);
        self
    }
}

pub fn register_with_email(email: &str, client: &Client) -> i32 {
    client
        .post("/register")
        .header(ContentType::JSON)
        .body(json!({ "email": email }).to_string())
        .dispatch()
        .body_string()
        .unwrap()
        .parse::<i32>()
        .unwrap()
}

pub fn register(client: &Client) -> i32 {
    register_with_email("fake@fake.fake", client)
}
