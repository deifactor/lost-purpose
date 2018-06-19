CREATE TABLE decks (
       id INTEGER PRIMARY KEY NOT NULL,
       user_id BIGINT NOT NULL,
       -- The position of the deck in the user's list of decks.
       position INTEGER NOT NULL,
       name VARCHAR NOT NULL,
       pile VARCHAR NOT NULL,
       UNIQUE (id, name),
       UNIQUE (position, user_id),
       FOREIGN KEY (user_id) REFERENCES users(id)
)
