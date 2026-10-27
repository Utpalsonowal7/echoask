# Contributing to EchoAsk

Thanks for helping improve EchoAsk.

## Local setup

1. Install Node.js 20 or newer and PostgreSQL.
2. Follow the setup steps in README.md.
3. Keep API secrets in server/.env. Never commit credentials or real user data.

## Changes

- Keep API modules separated by feature.
- Validate all request bodies at the route boundary.
- Keep public profile responses free of private account fields.
- Add a clear commit message that describes one focused change.
- Update the README when setup or user-facing behavior changes.

## Pull requests

Describe the user-visible change, note any environment variables added, and
include screenshots for substantial UI updates.

