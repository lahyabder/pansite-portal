import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PAN Admin — Back Office',
    template: '%s | PAN Admin',
  },
  description: "Espace d'administration du Port Autonome de Nouadhibou",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.variable} ${ibmPlexArabic.variable} font-sans antialiased bg-admin-bg text-admin-text`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

