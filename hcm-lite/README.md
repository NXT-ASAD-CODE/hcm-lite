# HCM Lite

AI-assisted Human Capital Management for Admin, HR and Employees.
Built for the Saylani Hackathon, 24 October 2026.

**Live app:** (add hosted link)
**API:** (add hosted API link)

## Stack
Next.js + MUI · Express · MongoDB Atlas (Mongoose) · JWT + bcrypt · hosted LLM API with tool calling · pdfkit

## Quick start (milestone 00)
See `docs/PACKAGES.md` for the exact commands. In short:

```bash
# server
cd server
cp .env.example .env        # fill MONGODB_URI and JWT_SECRET
npm install express mongoose dotenv cors helmet morgan
npm install -D nodemon
npm run dev

# client (from the project root)
npx create-next-app@latest client --js --eslint --app --no-src-dir --no-tailwind --import-alias "@/*"
cd client && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/material-nextjs axios
cd .. && bash scripts/create-client-folders.sh
```

## First Admin
Open the app on a fresh database: the first-run setup asks for the company name and Admin account
(or set ADMIN_EMAIL / ADMIN_PASSWORD in `server/.env`).

## AI key
Set `AI_API_KEY`, `AI_MODEL` (and `AI_BASE_URL` if needed) in `server/.env`. The browser never calls the AI provider.

## Tests
```bash
cd server && npm test
```

## Done / not done
(fill in as you finish each milestone)

## Assumptions
- Late = after 09:15; half day < 5 h; status order: on_leave > absent > missing_checkout > half_day > late > present
- Monthly tax = annual tax on earned gross x 12, divided by 12
- Pending and approved leave both count when checking balance
- Unpaid leave days are deducted in addition to absences (decide and keep consistent)
