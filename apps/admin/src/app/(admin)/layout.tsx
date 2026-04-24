import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AdminLangProvider } from "@/lib/AdminLangContext";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
