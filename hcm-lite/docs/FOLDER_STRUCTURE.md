# HCM Lite — Folder Structure

Stack from your roadmap: **Next.js + MUI** (client) · **Express + Mongoose** (server) · **MongoDB Atlas** · hosted LLM API.

Request flow:
`Browser (Next.js + MUI) → REST → Express → authenticate JWT → authorize role + record scope → validate → service → MongoDB`.
The AI route follows the same server path and calls the same services. The model never touches MongoDB.

## Full tree

```
hcm-lite/
├── .gitignore
├── .env.example                  (pointer; real examples live in server/ and client/)
├── README.md
├── docs/
│   ├── FOLDER_STRUCTURE.md       (this file)
│   └── PACKAGES.md               (install commands)
├── scripts/
│   └── create-client-folders.sh  (adds client feature folders after create-next-app)
│
├── server/                       Express API
│   ├── package.json
│   ├── .env.example
│   ├── scripts/
│   │   └── reset-db.js           (drop DB for a fresh install)
│   ├── tests/
│   │   ├── unit/rules.test.js    (39 passing tests for the business rules)
│   │   └── integration/          (API tests with supertest)
│   └── src/
│       ├── server.js             start HTTP server + connect DB
│       ├── app.js                express app, middleware, routes
│       ├── config/               env.js · db.js · constants.js
│       ├── middleware/           authenticate · authorizeRoles · enforceScope · validate
│       │                         rateLimiters · notFound · errorHandler
│       ├── models/               (Mongoose, *.model.js)
│       │     CompanySettings · User · Department · Designation · Employee
│       │     LeaveType · Holiday · Attendance · AttendanceCorrection
│       │     LeaveRequest · PayrollRun · Payslip · Announcement
│       │     Notification · AuditLog · AiInteractionLog
│       ├── routes/               health · setup · auth · settings · department · designation
│       │                         leaveType · holiday · user · employee · attendance · leave
│       │                         payroll · payslip · analytics · announcement · notification · audit
│       │                         + index.js (mounts everything under /api)
│       ├── controllers/          thin: read request, call service, send response
│       ├── services/             ALL business rules + authorization-aware queries
│       │                         + audit.service · notification.service · csv.service
│       ├── validators/           zod request schemas
│       ├── ai/                   ai.routes · ai.controller · ai.service (tool loop)
│       │                         ai.tools · ai.prompts · ai.validators · ai.log.service
│       └── utils/
│           ├── rules.js          TESTED: working days, attendance status, leave check, payslip
│           ├── geo.js            TESTED: Haversine + camera check (bonus)
│           ├── tax.js            (re-export annualTax or move it here)
│           ├── dates.js · money.js · pagination.js · password.js
│           ├── ApiError.js · asyncHandler.js
│           └── pdf/payslipPdf.js
│
└── client/                       Next.js + MUI  (created by create-next-app, then folders added by the script)
    ├── .env.local                NEXT_PUBLIC_API_URL only (never put secrets here)
    ├── app/                      routes, pages, layouts (App Router)
    │   ├── (auth)/               setup · login · change-password
    │   └── (app)/                authenticated area
    │       ├── admin/            dashboard · settings · departments · designations · leave-types
    │       │                     holidays · users · payroll · audit-logs · announcements …
    │       ├── hr/               dashboard · employees(+new, [id]) · attendance · corrections
    │       │                     leave-requests · payroll · announcements
    │       ├── employee/         dashboard · attendance · leave(+new) · payslips · profile
    │       └── notifications/
    ├── components/               shared UI: AppShell · Sidebar · Topbar · StatCard · DataTable
    │                             ConfirmDialog · EmptyState · LoadingState · ErrorState
    │                             RoleGuard · NotificationBell · AnnouncementList · AiChatPanel
    ├── features/                 one folder per module, each with components/ hooks/ api.js
    │                             auth · setup · organization · employees · attendance · leave
    │                             payroll · dashboard · ai · announcements · notifications · audit
    ├── lib/                      apiClient · session · format · roles
    └── theme/                    theme.js · ThemeRegistry.js (MUI + emotion for Next.js)
```

## Conventions (from your roadmap)

- Single API prefix: `/api`. Consistent JSON errors and correct status codes (400, 401, 403, 404, 409, 422).
- Controllers stay thin. Calculations and scoped queries live in `services/`.
- Validate every request body, query, id and date on the server (`validators/`).
- Indexes / unique constraints: employee code, email, one attendance record per employee per day.
- Timestamps in UTC in the database; display in the company timezone.
- Dashboards, REST and AI tools call the SAME service functions.

## Which folder gets filled in which milestone

| Milestone | Server | Client |
|---|---|---|
| 00 Setup & repo | `app.js`, `server.js`, `config/`, `routes/health.routes.js` | create-next-app, MUI theme, `lib/apiClient.js` |
| 01 Auth & first Admin | `User`, `CompanySettings`, `auth`, `setup`, `middleware/authenticate`, `authorizeRoles` | `(auth)/setup`, `login`, `change-password`, `AppShell`, `RoleGuard` |
| 02 Organization setup | `settings`, `department`, `designation`, `leaveType`, `holiday`, `user` | admin pages |
| 03 Employees | `Employee`, `employee` module, `password.js` | HR employee pages |
| 04 Attendance | `Attendance`, `AttendanceCorrection`, `attendance` module, `utils/rules.js` | employee check-in, HR board |
| 05 Leave | `LeaveRequest`, `leave` module | leave form, HR inbox |
| 06 Payroll | `PayrollRun`, `Payslip`, `payroll`, `payslip`, `pdf/payslipPdf.js` | payroll + payslip pages |
| 07 Dashboards | `analytics` module | three dashboards (charts) |
| 08 AI | `ai/` folder, `AiInteractionLog` | `AiChatPanel`, Summarize button, smart-leave box |
| 09 Comms & audit | `Announcement`, `Notification`, `AuditLog`, `audit`, `notification` | bell, announcements, audit page |
| 10 QA & deploy | tests, `reset-db.js` | loading/empty/error states, responsive pass |
