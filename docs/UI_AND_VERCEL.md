# HCM Lite — UI first, then Vercel

## Part 1: Add the UI to your project (Windows)

1. Unzip `hcm-lite-ui.zip`. You get three folders: `client`, `scripts`, `docs`.
2. Copy those three folders into `D:\Real Projects\hcm-lite`. When Windows asks, choose **Replace the files in the destination** (it only replaces your empty placeholder files; it does not touch `package.json`).
3. Open a terminal in `D:\Real Projects\hcm-lite` and fill the pages that are not built yet:
   ```
   node scripts/fill-placeholder-pages.js
   ```
   (An empty `page.js` breaks `next build`, so every unbuilt page gets a "Coming soon" page.)
4. Create `client\.env.local` with one line (no spaces):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
5. Optional cleanup: delete `client\app\page.module.css` (the default Next.js page no longer uses it).
6. Make sure the extra package is there (it is normally installed with MUI, this just makes sure):
   ```
   cd client
   npm install @emotion/cache
   ```

## Part 2: Run it and look at it

Two terminals:

```
cd server
npm run dev
```
```
cd client
npm run dev
```

Open http://localhost:3000

What you will see:
- Fresh database: the **Set up your company** page. Fill it in and you land on the **Admin dashboard**.
- After setup: the **Sign in** page.
- Sidebar (dark navy) with sections, top bar with role badge, notification bell and account menu (change password, log out).
- Cards show a dash and "No data yet". This is on purpose: the app starts empty and never shows fake numbers.
- Menu items such as Departments open a "Coming soon" page that names the milestone that builds it.
- Shrink the browser window: the sidebar becomes a slide-in menu (phone layout).

The HR and Employee dashboards appear when you sign in with an HR or Employee account (those accounts are created in Milestones 02 and 03).

Before you push, make sure the production build passes (Vercel runs the same command):
```
cd client
npm run build
```

## Part 3: Git commands for the UI

```
git status
```
`client/.env.local` must NOT appear. Then:

```
git add client/theme client/lib client/features/auth
git commit -m "feat(ui): add MUI theme, API client and auth context"

git add client/components
git commit -m "feat(ui): add app shell, sidebar, top bar and shared components"

git add "client/app/layout.js" "client/app/globals.css" "client/app/page.js" "client/app/(auth)"
git commit -m "feat(ui): add setup, login and change-password pages"

git add "client/app/(app)"
git commit -m "feat(ui): add role dashboards and placeholder pages"

git add scripts docs
git commit -m "chore: add placeholder page script and UI docs"

git push
```

## Part 4: Deploy the client on Vercel

Vercel hosts the Next.js client. The Express server needs its own host (Render, Railway, etc.), covered at the end.

### Before you start
- Your code is on GitHub and `npm run build` passes in `client`.
- `client/.env.local` is NOT on GitHub (it is in `.gitignore`).

### Steps
1. Go to https://vercel.com and choose **Sign Up**, then **Continue with GitHub**.
2. Click **Add New...**, then **Project**.
3. Find the `hcm-lite` repository and click **Import**. (If it is not listed, click "Adjust GitHub App Permissions" and allow the repository.)
4. On the configuration screen:
   - **Framework Preset:** Next.js (it detects this).
   - **Root Directory:** click **Edit** and choose **client**. This step is required, because your Next.js app is in the `client` folder, not the repository root.
   - Leave the build and install commands as they are.
5. Open **Environment Variables** and add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: the URL of your hosted backend ending in `/api`, for example `https://hcm-lite-api.onrender.com/api`
   (If the backend is not hosted yet, you can put `http://localhost:5000/api` for now. The pages will load, but the deployed site cannot log in until the backend is hosted. Change the value later and redeploy.)
6. Click **Deploy**. After a minute or two you get a link like `https://hcm-lite.vercel.app`.

### Every update after that
Run `git push`. Vercel builds and publishes automatically.

### Changing an environment variable
`NEXT_PUBLIC_*` values are baked into the build. After you change one in Vercel (Project, Settings, Environment Variables), go to **Deployments**, open the latest one, click the three dots, and choose **Redeploy**.

### Host the backend (needed for login to work online)
1. Create a Web Service on Render (or similar), connected to the same GitHub repository.
   - Root Directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
2. Add the same variables you have in `server/.env` in the host's Environment settings: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and so on.
3. Set `CLIENT_ORIGIN` to your Vercel address with no trailing slash, for example `https://hcm-lite.vercel.app`. Without this the browser blocks the requests (CORS error).
4. In MongoDB Atlas, Network Access must allow `0.0.0.0/0` (hosting servers change IP addresses).
5. Put the backend address in Vercel as `NEXT_PUBLIC_API_URL` (ending in `/api`) and redeploy.
6. Test: open `https://your-backend/api/health`. It should show `"database":"connected"`.

(We will do the backend hosting step by step when you reach it.)

### Common problems
| Problem | Fix |
|---|---|
| Build fails: "The default export is not a React Component in page" | An empty `page.js` exists. Run `node scripts/fill-placeholder-pages.js`, commit, push. |
| Build fails: "Module not found: @emotion/cache" | In `client` run `npm install @emotion/cache`, commit `package.json` and `package-lock.json`. |
| Deployed page shows "404" | Root Directory is not set to `client`. Project Settings, General, Root Directory. |
| Login says "Cannot reach the server" | `NEXT_PUBLIC_API_URL` is wrong or the backend is not hosted. Fix it and Redeploy. |
| Browser console shows a CORS error | `CLIENT_ORIGIN` on the backend must exactly match the Vercel address. |
| Site works locally but not online | Check Vercel, Deployments, the build log, and the Runtime Logs. |
