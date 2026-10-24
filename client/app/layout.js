import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata = {
  title: 'HCM Lite',
  description: 'AI-assisted Human Capital Management for Admin, HR and Employees',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
