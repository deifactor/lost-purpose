CREATE TABLE decks (
       id SERIAL PRIMARY KEY,
       user_id INTEGER NOT NULL,
       -- The position of the deck in the user's list of decks.
       position INTEGER NOT NULL,
       name TEXT NOT NULL,
       pile JSONB NOT NULL,
       UNIQUE (position, user_id),
       FOREIGN KEY (user_id) REFERENCES users(id)
)
