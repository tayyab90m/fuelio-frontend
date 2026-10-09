# Fuelio — Frontend

Coach dashboard for meal planning, macro tracking and client nutrition plans. A React single-page app that talks to the [fuelio-backend](https://github.com/tayyab90m/fuelio-backend) REST API.

## Stack

- React 18 + TypeScript, built with Create React App 5
- Redux Toolkit + `redux-persist` (only the signed-in user is persisted)
- React Router 7
- Axios for the REST client (`src/apiServices`)
- Formik + Yup for forms
- Tailwind CSS + shadcn/Radix UI components
- `react-toastify` for notifications

## Getting started

### 1. Run the backend

Follow the [backend README](https://github.com/tayyab90m/fuelio-backend#getting-started) (Postgres, migrations, seed). By default it listens on `http://localhost:3000`.

### 2. Install and configure

```bash
yarn install
cp .env.example .env
```

| Variable | Purpose | Default in `.env.example` |
| --- | --- | --- |
| `REACT_APP_API_URL` | Base URL of the Fuelio backend (no trailing slash) | `http://localhost:3000` |

`.env` is git-ignored. Create React App only exposes variables prefixed with `REACT_APP_`, and they are baked in at build time — so never put secrets in them.

### 3. Start the app

```bash
yarn start
```

Opens on [http://localhost:3007](http://localhost:3007) (set in the `start` script so it doesn't clash with the backend's port 3000). Sign in with one of the seeded accounts listed in the backend README (an admin, a coach and a client), or create a client account on `/register`.

## Roles

The backend decides what each role may do; the UI only mirrors it so people don't see screens that would fail.

| Role | Lands on | Sees |
|---|---|---|
| `client` | Meal Plan Generator | The generator and **My Plans** only. Typing a staff URL redirects back. |
| `coach` | Coach Dashboard | Everything for managing content (goals, meals, recipes, ingredients, ...), plus the generator and My Plans |
| `admin` | Coach Dashboard | Everything a coach sees, plus **Users** (create users, change roles, delete) |

- `/register` always creates a `client`. Only an admin can promote someone (Users screen).
- The signed-in user's profile is re-read from `/auth/me` on load, so a role change or an old saved session is picked up. A session with no known role is treated as a client.
- Route guards live in `src/routes/guards.tsx`; the sidebar filters by role in `src/screens/meal-dashboard/index.tsx`.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn start` | Dev server with hot reload on port 3007 |
| `yarn build` | Production build into `build/` |
| `yarn test` | Jest in watch mode (`yarn test:ci` runs once, for CI) |
| `npx tsc --noEmit` | Type-check |
| `npx eslint src --ext .ts,.tsx` | Lint (the codebase is warning-free) |

## Project layout

```
src/
  apiServices/
    instance/       axios instance, token refresh + session-expiry handling
    methods/        apiGet / apiGetAll / apiPost / apiPut / apiPatch / apiDelete
    errorHandling/  turns backend { error: { message } } into one toast
    endpoints/      one folder per resource (categories, goals, recipes, ...)
  redux/            one slice + action file per feature
  screens/
    authentication/ login / register
    meal-dashboard/ admin screens: goals, activity levels, categories, cuisines,
                    units, ingredients, recipes, ...
    nutrition/      meals, meal types, diet plan
  components/       shared UI (shadcn primitives under components/ui)
  routes/           route table + role guards (guards.tsx)
```

## How it talks to the API

- All requests go through `src/apiServices/methods`. Add a new resource by creating a folder under `endpoints/`, calling these helpers, and exposing it through a Redux action.
- List endpoints are paginated by the backend (`?page=&limit=`, max 100 per page, response `{ data, meta }`). `apiGetAll` walks every page, so screens that need the full list just use it.
- **Auth:** the access token is sent as a bearer token. On a `401` the axios interceptor makes one shared refresh call (concurrent requests wait for it) and retries; if the refresh fails the user is signed out and sent to `/login` with a single "session expired" notice.
- **Errors:** the backend always replies `{ error: { message, statusCode } }`; `errorHandling` shows that message as a toast once.

## Screens and current limits

Working end to end against the backend: sign up/in/out, goals, activity levels, categories (including goal links), cuisines, units, ingredients, recipes (with substitutes), meal types, meals, user management, and the plan generator.

**Meal plans.** The questionnaire (including an optional dietary-restrictions question) generates macros, a per-meal split, a 7-day plan and a shopping list. Portions are scaled toward each meal's calorie target and the plan respects dietary restrictions strictly. Plans can be named and saved, and **My Plans** lists, opens, renames and deletes them. Saved plans are snapshots: later edits to meals or recipes don't change them.

Not finished:

- **Workout generator** and **Subscriptions** are static mock screens (staff only) with no backend.
- The **calorie/macro formula** is a placeholder on the backend (Mifflin-St Jeor x activity x goal adjustment) pending real nutrition rules.
- **Create React App is unmaintained**, and `yarn audit` reports many findings in its build tooling (none ship in the browser bundle). Migrating the build to Vite is the recommended follow-up.

## Testing

```bash
yarn test:ci          # unit tests (roles, route guards, validation, API adapters)
npx tsc --noEmit
npx eslint src --ext .ts,.tsx --max-warnings 0
```

CI (`.github/workflows/ci.yml`) runs type-check, lint with zero warnings allowed, the tests, and a production build (`CI=true`) on every push and pull request to `develop` and `main`. Jest 27 (bundled with CRA 5) can't read packages that only publish ESM/`exports`, so `package.json` maps `axios` and `react-router` to their CommonJS builds for tests.

## Deployment

`yarn build` produces a static bundle in `build/` that can be served by any static host. Set `REACT_APP_API_URL` to the public backend URL *before* building, and set the backend's `CORS_ORIGIN` to the site's origin (the backend refuses a wildcard in production).

### Docker

```bash
docker build --build-arg REACT_APP_API_URL=https://api.example.com -t fuelio-frontend .
docker run -p 8080:8080 fuelio-frontend
```

The image serves the bundle with nginx (non-root, port 8080): deep links fall back to `index.html`, hashed assets are cached for a year, and `index.html` is never cached. The API URL is baked in at build time, so the build fails if `REACT_APP_API_URL` isn't given. Put it behind TLS.
