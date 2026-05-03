# Tamil Nadu Assembly Results Dashboard

Deployment ready React dashboard for Tamil Nadu Assembly Election Results 2026.

## Already included

- Manual refresh button that calls `/api/results`
- Automatic refresh every 60 seconds
- Live IST clock updated every second
- Last ECI check time shown in IST
- Red and yellow professional election theme
- All 234 Tamil Nadu Assembly constituencies bundled locally
- District dropdown
- Constituency dropdown
- Clickable district map style panel
- Party seat lead chart
- Constituency drilldown
- Candidate vote bars
- Turnout fields including male, female and third gender votes
- Counting centre and round fields
- Round margin timeline chart
- Searchable constituency table
- Vercel serverless API at `api/results.js`
- Netlify serverless API at `netlify/functions/eci.js` with redirect configured

## Deploy on Vercel

1. Upload this folder to GitHub.
2. Import the repo in Vercel.
3. Framework: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

No code modification is needed.

## Deploy on Netlify

1. Upload this folder to GitHub.
2. Create a new Netlify site from the GitHub repo.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Netlify functions are already configured in `netlify.toml`.

No code modification is needed.

## Local run

```bash
npm install
npm run dev
```

## Live data note

The app checks the official ECI results site through a serverless proxy to avoid browser CORS problems. Until ECI publishes parseable live result tables, the UI shows bundled fallback/demo values while keeping the full dashboard functional. When ECI data becomes parseable, `/api/results` returns live rows and the frontend updates automatically through the existing refresh system.
