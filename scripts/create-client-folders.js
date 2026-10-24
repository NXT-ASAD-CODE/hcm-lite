const fs = require('fs');
const path = require('path');

const C = 'client';
if (!fs.existsSync(C)) {
  console.error('client/ not found. Run create-next-app first.');
  process.exit(1);
}

function file(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, '');
}
function dir(p) {
  fs.mkdirSync(p, { recursive: true });
  const keep = path.join(p, '.gitkeep');
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, '');
}
const j = (...parts) => path.join(C, ...parts);

['setup', 'login', 'change-password'].forEach((p) => file(j('app', '(auth)', p, 'page.js')));
file(j('app', '(auth)', 'layout.js'));

['dashboard', 'settings', 'departments', 'designations', 'leave-types', 'holidays', 'users', 'payroll', 'audit-logs', 'announcements', 'employees', 'attendance', 'leave']
  .forEach((p) => file(j('app', '(app)', 'admin', p, 'page.js')));

['dashboard', 'employees', 'employees/new', 'employees/[id]', 'attendance', 'corrections', 'leave-requests', 'payroll', 'announcements']
  .forEach((p) => file(j('app', '(app)', 'hr', ...p.split('/'), 'page.js')));

['dashboard', 'attendance', 'leave', 'leave/new', 'payslips', 'profile']
  .forEach((p) => file(j('app', '(app)', 'employee', ...p.split('/'), 'page.js')));

file(j('app', '(app)', 'notifications', 'page.js'));
file(j('app', '(app)', 'layout.js'));

['AppShell', 'Sidebar', 'Topbar', 'StatCard', 'DataTable', 'ConfirmDialog', 'PageHeader', 'EmptyState', 'LoadingState', 'ErrorState', 'RoleGuard', 'NotificationBell', 'AnnouncementList', 'AiChatPanel']
  .forEach((f) => file(j('components', f + '.js')));

['auth', 'setup', 'organization', 'employees', 'attendance', 'leave', 'payroll', 'dashboard', 'ai', 'announcements', 'notifications', 'audit'].forEach((f) => {
  dir(j('features', f, 'components'));
  dir(j('features', f, 'hooks'));
  file(j('features', f, 'api.js'));
});

['apiClient', 'session', 'format', 'roles'].forEach((f) => file(j('lib', f + '.js')));
['theme', 'ThemeRegistry'].forEach((f) => file(j('theme', f + '.js')));

console.log('Client folders created.');