import type { Metadata } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-noto-arabic',
  subsets: ['arabic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Port Autonome de Nouadhibou | PAN',
    template: '%s | PAN',
  },
  description:
    "Site officiel du Port Autonome de Nouadhibou — Porte d'entrée stratégique de la Mauritanie sur l'Atlantique.",
  keywords: ['port', 'Nouadhibou', 'Mauritanie', 'PAN', 'maritime', 'logistique'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
