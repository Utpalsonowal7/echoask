# EchoAsk product brief

## What it is

EchoAsk gives a person one shareable profile link where friends, classmates, or
followers can leave anonymous notes. The profile owner manages the inbox and
decides when to pause new messages.

## Main user journeys

1. Create an account with a name, email, username, and password.
2. Verify the email with a one-time code, then open a private inbox.
3. Copy a public profile link and share it anywhere.
4. Let visitors send a message without creating an account.
5. Review, mark as read, or delete messages in the inbox.
6. Pause or resume incoming messages from the dashboard.
7. Ask Gemini for a few conversation-starter suggestions when composing.

## Product boundaries

- The app stores no sender account or sender IP address for anonymous notes.
- Email, password hashes, and inbox data are never returned by public profile
  endpoints.
- Gemini is optional for local setup. Its key stays on the API server.
- Email delivery can use SMTP. Local development can print verification codes
  in the API terminal.
- The web client and API run as separate workspaces. PostgreSQL runs locally;
  Docker is not required.

## First release scope

- Registration, email verification, login, logout, and cookie-backed sessions.
- Unique public usernames and editable profile details.
- Anonymous message submission and private inbox management.
- Message acceptance toggle and basic message suggestions.
- Responsive landing, authentication, dashboard, and public profile screens.

