table! {
    decks (id) {
        id -> Integer,
        user_id -> BigInt,
        position -> Integer,
        name -> Text,
        pile -> Text,
    }
}

table! {
    users (id) {
        id -> BigInt,
        created_at -> Timestamp,
    }
}

joinable!(decks -> users (user_id));

allow_tables_to_appear_in_same_query!(
    decks,
    users,
);
