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

Opens on [http://localhost:3007](http://localhost:3007) (set in the `start` script so it doesn't clash with the backend's port 3000). Sign in with the seeded account described in the backend README, or register a new one.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn start` | Dev server with hot reload on port 3007 |
| `yarn build` | Production build into `build/` |
| `yarn test` | CRA test runner (no frontend tests yet) |
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
  routes/           route table
```

## How it talks to the API

- All requests go through `src/apiServices/methods`. Add a new resource by creating a folder under `endpoints/`, calling these helpers, and exposing it through a Redux action.
- List endpoints are paginated by the backend (`?page=&limit=`, max 100 per page, response `{ data, meta }`). `apiGetAll` walks every page, so screens that need the full list just use it.
- **Auth:** the access token is sent as a bearer token. On a `401` the axios interceptor makes one shared refresh call (concurrent requests wait for it) and retries; if the refresh fails the user is signed out and sent to `/login` with a single "session expired" notice.
- **Errors:** the backend always replies `{ error: { message, statusCode } }`; `errorHandling` shows that message as a toast once.

## Screens and current limits

Working end to end against the backend: sign in/out, goals, activity levels, categories (including goal links), cuisines, units, ingredients, recipes (with substitutes), meal types, meals, and the diet-plan questionnaire.

Not backed by real data yet:

- **Workout generator** and **Subscriptions** are static mock screens — the backend has no endpoints for them.
- The **diet-plan calculation** is a placeholder formula on the backend (Mifflin-St Jeor × activity × goal adjustment). Weekly meal plan and shopping list sections are hidden because the backend doesn't generate them.

## Deployment

`yarn build` produces a static bundle in `build/` that can be served by any static host. Set `REACT_APP_API_URL` to the public backend URL *before* building, and set the backend's `CORS_ORIGIN` to the site's origin.
