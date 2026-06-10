# frontend_web

React frontend for the Tic Tac Toe app.

## Development

Install deps:

```bash
npm install
```

Run dev server:

```bash
npm start
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

## Environment variables

This app reads environment variables prefixed with `REACT_APP_` at build/start time (Create React App behavior).

Available container env vars (provided via the container `.env`):

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
"
