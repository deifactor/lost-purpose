table! {
    use diesel::sql_types::*;

    decks (id) {
        id -> Int4,
        user_id -> Int4,
        position -> Int4,
        name -> Text,
        pile -> Jsonb,
    }
}

table! {
    use diesel::sql_types::*;

    users (id) {
        id -> Int4,
        email -> Text,
        created_at -> Timestamptz,
    }
}

joinable!(decks -> users (user_id));

allow_tables_to_appear_in_same_query!(
    decks,
    users,
);
