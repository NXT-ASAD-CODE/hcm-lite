// Fills every EMPTY page.js under client/app with a "Coming soon" page.
// Why: Next.js fails to build (and fails on Vercel) when a page.js file is empty.
// Run from the hcm-lite root:   node scripts/fill-placeholder-pages.js
// Safe to run again: it only touches files that are empty, never real pages.
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join('client', 'app');
if (!fs.existsSync(APP_DIR)) {
  console.error('client/app not found. Run this from the hcm-lite folder.');
  process.exit(1);
}

// route (without the (app) group) -> [title, milestone]
const PAGES = {
  'admin/settings': ['Company settings', 'Milestone 02 · Organization setup'],
  'admin/departments': ['Departments', 'Milestone 02 · Organization setup'],
  'admin/designations': ['Designations', 'Milestone 02 · Organization setup'],
  'admin/leave-types': ['Leave types', 'Milestone 02 · Organization setup'],
  'admin/holidays': ['Holidays', 'Milestone 02 · Organization setup'],
  'admin/users': ['User accounts', 'Milestone 02 · Organization setup'],
  'admin/employees': ['Employees', 'Milestone 03 · Employees'],
  'admin/attendance': ['Attendance', 'Milestone 04 · Attendance'],
  'admin/leave': ['Leave', 'Milestone 05 · Leave'],
  'admin/payroll': ['Payroll', 'Milestone 06 · Payroll'],
  'admin/announcements': ['Announcements', 'Milestone 09 · Announcements and audit'],
  'admin/audit-logs': ['Audit log', 'Milestone 09 · Announcements and audit'],
  'hr/employees': ['Employees', 'Milestone 03 · Employees'],
  'hr/employees/new': ['Register employee', 'Milestone 03 · Employees'],
  'hr/employees/[id]': ['Employee profile', 'Milestone 03 · Employees'],
  'hr/attendance': ['Attendance board', 'Milestone 04 · Attendance'],
  'hr/corrections': ['Attendance corrections', 'Milestone 04 · Attendance'],
  'hr/leave-requests': ['Leave requests', 'Milestone 05 · Leave'],
  'hr/payroll': ['Payroll', 'Milestone 06 · Payroll'],
  'hr/announcements': ['Announcements', 'Milestone 09 · Announcements and audit'],
  'employee/attendance': ['My attendance', 'Milestone 04 · Attendance'],
  'employee/leave': ['My leave', 'Milestone 05 · Leave'],
  'employee/leave/new': ['Apply for leave', 'Milestone 05 · Leave'],
  'employee/payslips': ['My payslips', 'Milestone 06 · Payroll'],
  'employee/profile': ['My profile', 'Milestone 03 · Employees'],
  notifications: ['Notifications', 'Milestone 09 · Announcements and audit'],
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'page.js') out.push(full);
  }
  return out;
}

let filled = 0;
const unknown = [];

for (const file of walk(APP_DIR)) {
  if (fs.readFileSync(file, 'utf8').trim() !== '') continue; // real page: leave it alone

  // client/app/(app)/admin/settings/page.js  ->  admin/settings
  const route = path
    .relative(APP_DIR, path.dirname(file))
    .split(path.sep)
    .filter((part) => !(part.startsWith('(') && part.endsWith(')')))
    .join('/');

  const info = PAGES[route];
  if (!info) {
    unknown.push(file);
    continue;
  }

  const [title, milestone] = info;
  fs.writeFileSync(
    file,
    `import ComingSoon from '@/components/ComingSoon';\n\n` +
      `export default function Page() {\n` +
      `  return <ComingSoon title=${JSON.stringify(title)} milestone=${JSON.stringify(milestone)} />;\n` +
      `}\n`
  );
  filled++;
}

console.log(`Filled ${filled} empty page(s) with a Coming soon page.`);
if (unknown.length) {
  console.log('These empty pages were not recognised. Fill or delete them by hand:');
  unknown.forEach((f) => console.log('  ' + f));
}
