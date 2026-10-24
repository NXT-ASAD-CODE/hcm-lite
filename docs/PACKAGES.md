# HCM Lite — Packages and Setup Commands

Follow your roadmap: install what each milestone needs. Milestone 00 only needs the first block of each side.
No versions are pinned below: npm installs the latest release. Commit `package-lock.json` after installing so versions stay fixed.

Requirements: Node.js (current LTS), Git, a MongoDB Atlas free cluster.

---

## Milestone 00 — create the project

```bash
mkdir hcm-lite && cd hcm-lite     # or unzip the scaffold and cd into it
git init
```

### Server (Express)

```bash
cd server
npm install express mongoose dotenv cors helmet morgan
npm install -D nodemon
```

Add scripts to `server/package.json` (the scaffold already has them):
`"dev": "nodemon src/server.js"`, `"start": "node src/server.js"`, `"test": "node tests/unit/rules.test.js"`.

### Client (Next.js + MUI)

Run from the project root (hcm-lite/):

```bash
npx create-next-app@latest client --js --eslint --app --no-src-dir --no-tailwind --import-alias "@/*"
cd client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/material-nextjs
npm install axios
cd ..
bash scripts/create-client-folders.sh
```

(If `create-next-app` asks questions, choose JavaScript, App Router, no Tailwind, no `src/` directory.)

Client env: create `client/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Milestone 01 — Auth and first Admin (server)

```bash
cd server
npm install bcryptjs jsonwebtoken zod express-rate-limit cookie-parser
```

| Package | Why |
|---|---|
| bcryptjs | hash passwords (pure JS, no build problems on free hosting) |
| jsonwebtoken | sign and verify JWT |
| zod | validate bodies, queries, ids, dates (also reuse it for AI tool arguments) |
| express-rate-limit | rate limit login and AI endpoints |
| cookie-parser | only if you store the JWT in an httpOnly cookie (otherwise skip) |

Client side for forms:
```bash
cd client
npm install react-hook-form zod @hookform/resolvers notistack
```

---

## Milestones 02–05 (org, employees, attendance, leave)

Server:
```bash
cd server
npm install csv-parse multer     # only if you build CSV import (optional)
```
Client (dates and tables):
```bash
cd client
npm install dayjs @mui/x-date-pickers @mui/x-data-grid
```
`@mui/x-data-grid` is optional: use plain MUI `Table` + `TablePagination` if you want fewer dependencies.

---

## Milestone 06 — Payroll and payslip PDF

```bash
cd server
npm install pdfkit
```

---

## Milestone 07 — Dashboards

```bash
cd client
npm install @mui/x-charts      # MUI's own charts; or:  npm install recharts
```
Pick one chart library, not both.

---

## Milestone 08 — AI assistant (server only)

Install the official SDK of the provider you choose when you reach this milestone (your roadmap says to choose then). Examples:

```bash
cd server
npm install openai            # OpenAI, or any OpenAI-compatible endpoint (set AI_BASE_URL)
# or:  npm install @google/genai
# or:  npm install groq-sdk
```
Keep `AI_API_KEY`, `AI_MODEL` (and `AI_BASE_URL` if needed) in `server/.env` only. Never use `NEXT_PUBLIC_*` for them.

---

## Milestone 10 — Quality and tests

```bash
cd server
npm install -D jest supertest mongodb-memory-server eslint prettier
```
Then change the `"test"` script to `jest` and move/keep `tests/unit/rules.test.js` (it is plain Node `assert`; either run it with `node` or convert to Jest).

Optional on the client: `npm install -D prettier`

---

## Bonus only (after core works)

```bash
cd client
npm install @vladmandic/face-api     # camera + face detection in the browser (bonus)
# or: npm install @mediapipe/tasks-vision
cd ../server
npm install geolib                   # or keep using utils/geo.js (already written, tested)
```

---

## Everything at a glance

**server/ dependencies:** express, mongoose, dotenv, cors, helmet, morgan, bcryptjs, jsonwebtoken, zod, express-rate-limit, pdfkit, (cookie-parser), (csv-parse, multer), AI provider SDK
**server/ devDependencies:** nodemon, jest, supertest, mongodb-memory-server, eslint, prettier

**client/ dependencies:** next, react, react-dom (from create-next-app), @mui/material, @emotion/react, @emotion/styled, @mui/icons-material, @mui/material-nextjs, axios, react-hook-form, zod, @hookform/resolvers, notistack, dayjs, @mui/x-date-pickers, (@mui/x-data-grid), @mui/x-charts or recharts

## One-shot install if you want everything now (core only, no bonus)

```bash
cd server
npm install express mongoose dotenv cors helmet morgan bcryptjs jsonwebtoken zod express-rate-limit pdfkit
npm install -D nodemon

cd ../client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/material-nextjs axios react-hook-form zod @hookform/resolvers notistack dayjs @mui/x-date-pickers @mui/x-charts
```
(Roadmap says one milestone at a time, so the milestone blocks above are the recommended way.)

## MUI + Next.js note

With the App Router, MUI needs an emotion cache provider so styles don't flicker. `@mui/material-nextjs` provides `AppRouterCacheProvider`. Put it in `client/app/layout.js` together with `theme/ThemeRegistry.js` (ThemeProvider + CssBaseline). Check the current MUI "Next.js App Router" guide for the exact snippet for your installed versions.

## Server env example (also in server/.env.example)

```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=
AI_API_KEY=
AI_MODEL=
AI_BASE_URL=
TZ=Asia/Karachi
```
