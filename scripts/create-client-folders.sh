#!/usr/bin/env bash
# Run AFTER `create-next-app` has created the client/ folder.
# Usage (from the hcm-lite root):  bash scripts/create-client-folders.sh
# It adds the feature folders from FOLDER_STRUCTURE.md. It never overwrites existing files.
set -e

C="client"
if [ ! -d "$C" ]; then
  echo "client/ not found. Run create-next-app first (see docs/PACKAGES.md)."
  exit 1
fi

mk() { mkdir -p "$1"; [ -e "$1/.gitkeep" ] || touch "$1/.gitkeep"; }
mf() { mkdir -p "$(dirname "$1")"; [ -e "$1" ] || touch "$1"; }

# ---- app (routes) ----
mf "$C/app/(auth)/setup/page.js"
mf "$C/app/(auth)/login/page.js"
mf "$C/app/(auth)/change-password/page.js"

# Admin
for p in dashboard settings departments designations leave-types holidays users payroll audit-logs announcements employees attendance leave; do
  mf "$C/app/(app)/admin/$p/page.js"
done
# HR
for p in dashboard employees employees/new "employees/[id]" attendance corrections leave-requests payroll announcements; do
  mf "$C/app/(app)/hr/$p/page.js"
done
# Employee
for p in dashboard attendance leave leave/new payslips profile; do
  mf "$C/app/(app)/employee/$p/page.js"
done
mf "$C/app/(app)/notifications/page.js"
mf "$C/app/(app)/layout.js"
mf "$C/app/(auth)/layout.js"

# ---- components (shared UI) ----
for f in AppShell Sidebar Topbar StatCard DataTable ConfirmDialog PageHeader EmptyState LoadingState ErrorState RoleGuard NotificationBell AnnouncementList AiChatPanel; do
  mf "$C/components/$f.js"
done

# ---- features (one folder per module) ----
for f in auth setup organization employees attendance leave payroll dashboard ai announcements notifications audit; do
  mk "$C/features/$f/components"
  mk "$C/features/$f/hooks"
  mf "$C/features/$f/api.js"
done

# ---- lib ----
mf "$C/lib/apiClient.js"
mf "$C/lib/session.js"
mf "$C/lib/format.js"
mf "$C/lib/roles.js"

# ---- theme ----
mf "$C/theme/theme.js"
mf "$C/theme/ThemeRegistry.js"

echo "Client folders created."
