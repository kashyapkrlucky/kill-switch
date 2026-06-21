# Kill Switch

Kill Switch is a feature flag control plane for managing release switches across projects and environments. It gives teams one canonical flag per feature, with separate rollout state for development, staging, and production.

## What It Does

- Manage projects and feature flags from an authenticated dashboard.
- Keep one flag per feature instead of duplicating flags for each environment.
- Toggle flag state independently for development, staging, and production.
- Issue project-scoped API tokens for runtime flag evaluation.
- Expose a low-latency access endpoint for applications and SDKs.
- Track API token usage and token limits.

## Environment Model

Flags are environment-aware by design:

```ts
{
  code: "APP0001",
  name: "New Checkout",
  environments: {
    development: { status: "active" },
    staging: { status: "inactive" },
    production: { status: "inactive" }
  }
}
```

New flags default to development on, staging off, and production off. The legacy `status` field is still present and is derived from production status for backward compatibility.

Runtime clients should request the environment they are evaluating:

```bash
curl -X GET "http://localhost:3000/api/access/flags?environment=production" \
  -H "Authorization: Bearer <project-token>"
```

If `environment` is omitted, the API defaults to production.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand
- MongoDB with Mongoose
- JWT cookie authentication
- Jest with MongoDB Memory Server

## Project Structure

```text
src/
  app/                  Next.js routes, layouts, and API handlers
  components/           Reusable UI and feature components
  core/
    config/             Environment access helpers
    lib/                Auth, database, cache, HTTP clients
    mailer/             Email templates and delivery
    models/             Mongoose models
    types/              Application and database types
    utils/              Shared helpers and response utilities
  hooks/                Client hooks
  store/                Zustand stores
  styles/               Global styles
tests/                  API and database tests
public/                 Static assets
```

The `@/*` import alias points to `src/*`.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```bash
MONGODB_URI=mongodb://localhost:27017/kill-switch
JWT_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
SUPABASE_URL=
SUPABASE_ANON_KEY=
BREVO_API_KEY=
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev            # Start local development server
npm run build          # Build production app
npm run start          # Start production server
npm run lint           # Run ESLint
npm test               # Run Jest tests
npm run test:watch     # Run Jest in watch mode
npm run test:coverage  # Generate test coverage
```

## API Notes

Authenticated dashboard APIs use the session cookie created during sign-in.

Runtime flag evaluation uses project tokens:

```bash
GET /api/access/flags?environment=production
Authorization: Bearer <project-token>
```

Supported environment values:

- `development`
- `staging`
- `production`

The response returns flag state scoped to the requested environment.

## Verification

Before opening a PR or deploying, run:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Some local test/build commands may need permission to bind local ports because MongoDB Memory Server and Next/Turbopack start local worker processes.

## Production Notes

- Do not duplicate flags per environment. Use the `environments` state on a single flag.
- Production evaluation is the default for runtime access if no environment is supplied.
- API token cache entries are environment-specific.
- Keep `JWT_SECRET`, `MONGODB_URI`, and token/email provider secrets out of source control.
- Rotate project API tokens regularly and monitor usage limits.
