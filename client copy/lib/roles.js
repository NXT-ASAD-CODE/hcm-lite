export const ROLE_HOME = {
  admin: '/admin/dashboard',
  hr: '/hr/dashboard',
  employee: '/employee/dashboard',
};

export const ROLE_LABEL = {
  admin: 'Admin',
  hr: 'HR',
  employee: 'Employee',
};

// Sidebar menus. "section" adds a small heading above a group of links.
export const MENU = {
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', section: 'Overview' },
    { label: 'Company settings', href: '/admin/settings', icon: 'settings', section: 'Organization' },
    { label: 'Departments', href: '/admin/departments', icon: 'departments', section: 'Organization' },
    { label: 'Designations', href: '/admin/designations', icon: 'designations', section: 'Organization' },
    { label: 'Leave types', href: '/admin/leave-types', icon: 'leaveTypes', section: 'Organization' },
    { label: 'Holidays', href: '/admin/holidays', icon: 'holidays', section: 'Organization' },
    { label: 'User accounts', href: '/admin/users', icon: 'users', section: 'Organization' },
    { label: 'Employees', href: '/admin/employees', icon: 'employees', section: 'People' },
    { label: 'Attendance', href: '/admin/attendance', icon: 'attendance', section: 'People' },
    { label: 'Leave', href: '/admin/leave', icon: 'leave', section: 'People' },
    { label: 'Payroll', href: '/admin/payroll', icon: 'payroll', section: 'Payroll and updates' },
    { label: 'Announcements', href: '/admin/announcements', icon: 'announcements', section: 'Payroll and updates' },
    { label: 'Audit log', href: '/admin/audit-logs', icon: 'audit', section: 'Payroll and updates' },
  ],
  hr: [
    { label: 'Dashboard', href: '/hr/dashboard', icon: 'dashboard', section: 'Overview' },
    { label: 'Employees', href: '/hr/employees', icon: 'employees', section: 'People' },
    { label: 'Attendance board', href: '/hr/attendance', icon: 'attendance', section: 'People' },
    { label: 'Corrections', href: '/hr/corrections', icon: 'corrections', section: 'People' },
    { label: 'Leave requests', href: '/hr/leave-requests', icon: 'leave', section: 'People' },
    { label: 'Payroll', href: '/hr/payroll', icon: 'payroll', section: 'Payroll and updates' },
    { label: 'Announcements', href: '/hr/announcements', icon: 'announcements', section: 'Payroll and updates' },
  ],
  employee: [
    { label: 'Dashboard', href: '/employee/dashboard', icon: 'dashboard', section: 'Overview' },
    { label: 'My attendance', href: '/employee/attendance', icon: 'attendance', section: 'My work' },
    { label: 'My leave', href: '/employee/leave', icon: 'leave', section: 'My work' },
    { label: 'My payslips', href: '/employee/payslips', icon: 'payslips', section: 'My work' },
    { label: 'My profile', href: '/employee/profile', icon: 'profile', section: 'My work' },
  ],
};
