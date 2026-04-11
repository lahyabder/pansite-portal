import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AdminLangProvider } from "@/lib/AdminLangContext";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "PAN Command Center | Port Autonome de Nouadhibou",
  description: "Ultimate control panel for the PAN digital ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans">
        <AdminLangProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto animate-fade-in">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminLangProvider>
      </body>
    </html>
  );
}
