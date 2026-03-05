import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const tajawal = Tajawal({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PAN Admin — Back Office',
    template: '%s | PAN Admin',
  },
  description: "Espace d'administration du Port Autonome de Nouadhibou",
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.variable} ${tajawal.variable} font-sans antialiased bg-admin-bg text-admin-text`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

