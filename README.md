# EchoAsk

EchoAsk is a full-stack anonymous Q&A and feedback app. Create a profile,
share its link, receive anonymous notes, and manage them from a private inbox.
Gemini can suggest conversation starters while a visitor is writing.

The project keeps the React client and Express API in separate workspaces.
PostgreSQL runs directly on your machine; Docker is not required.

## Features

- Email-verified accounts with username availability enforced by PostgreSQL.
- Password hashes stored with bcrypt and long-lived, revocable HTTP-only sessions.
- Public share pages that expose only a user's name, username, short bio, and message status.
- Anonymous notes without a sender account or stored sender IP address.
- Private inbox with unread counts, mark-as-read, delete, and pause/resume controls.
- Optional Gemini-powered message suggestions; the API key stays on the server.
- Request validation, rate limits, CORS allow-list, Helmet headers, and bounded request bodies.
- Local development mode prints verification codes to the API terminal when SMTP is not configured.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- PostgreSQL 14 or newer
- A Gemini API key for message suggestions (optional)
- SMTP credentials for email delivery (optional for local development)

## Start locally

1. Create a PostgreSQL database named echoask.
2. Copy server/.env.example to server/.env and set DATABASE_URL to your local database.
3. Copy client/.env.example to client/.env if you want to change the API URL.
4. Install dependencies from the repository root:

~~~~sh
npm install
~~~~

5. Generate Prisma Client and create the database tables:

~~~~sh
npm run db:generate
npm run db:migrate
~~~~

6. Start the API and web client:

~~~~sh
npm run dev
~~~~

The client is served at http://localhost:5173 and the API at
http://localhost:4000. The API health endpoint is /api/health.

In local console mail mode, the API terminal prints the one-time verification
code. Enter it on the verification screen. To deliver real email, set
MAIL_MODE=smtp and configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD,
and MAIL_FROM in server/.env.

To enable message suggestions, set GEMINI_API_KEY in server/.env. The default
model is configurable through GEMINI_MODEL. The key is read only by the server.

## Database overview

- User: verified account, profile, and message-acceptance preference.
- VerificationCode: hashed, expiring email code with an attempt limit.
- Session: hashed random cookie token with a revocable expiration.
- Message: anonymous content addressed to one profile.

Use Prisma Studio during development with npm run db:studio.

## API overview

| Method | Path | Purpose |
| --- | --- | --- |
| POST | /api/auth/register | Create an account and send a verification code |
| POST | /api/auth/verify | Verify email and start a session |
| POST | /api/auth/verify/resend | Resend a verification code |
| POST | /api/auth/login | Start a session |
| POST | /api/auth/logout | Revoke the current session |
| GET | /api/auth/me | Read the signed-in user's profile |
| GET | /api/profiles/:username | Read a public profile |
| PATCH | /api/profiles/me | Update the signed-in profile or message setting |
| POST | /api/messages/to/:username | Send an anonymous note |
| GET | /api/messages/inbox | Read the private inbox and unread count |
| PATCH | /api/messages/:id/read | Mark a note as read |
| DELETE | /api/messages/:id | Delete a note |
| POST | /api/ai/suggestions | Generate three message ideas with Gemini |

All mutation routes validate request bodies. Authenticated routes use a
server-side session whose random token is stored in an HTTP-only cookie and
hashed in PostgreSQL.

## Repository map

~~~~text
client/       React, TypeScript, Vite UI
server/       Express API, TypeScript, Prisma, PostgreSQL
PRODUCT_SPEC.md
~~~~

## License

MIT. See LICENSE.

