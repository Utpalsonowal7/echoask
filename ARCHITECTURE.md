# Architecture notes

EchoAsk is a small monorepo with two independently runnable applications.

## Request flow

1. The React client sends JSON to the Express API with credentials enabled.
2. Route validators parse and normalize untrusted input.
3. Feature services own application rules and Prisma queries.
4. Prisma stores users, expiring verification codes, sessions, and messages in PostgreSQL.
5. The API returns safe DTOs; public profile queries select only public fields.

## Authentication

Passwords are bcrypt-hashed. Verification codes are stored as SHA-256 hashes,
expire after ten minutes, and allow at most five attempts. A successful login
creates a random session token. The raw token is placed in an HTTP-only cookie;
only its hash is stored in the Session table. Logging out revokes that session.

## Anonymous notes

Senders do not create accounts. The message service resolves a username to a
recipient, checks the recipient's acceptance setting, and stores the note.
Sender IP addresses are not written to the database.

## Gemini

The public profile's short bio can be used as context for the suggestion
request. The server calls Gemini's generateContent REST endpoint and returns
three short strings. The API key stays in the server environment and is never
sent to the browser.

## Local boundaries

PostgreSQL is expected to be installed on the developer machine. The API,
client, and database are separate processes; no Docker configuration is used.

