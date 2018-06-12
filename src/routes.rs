use false_name;
use rocket_contrib::{Json, Value};

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
