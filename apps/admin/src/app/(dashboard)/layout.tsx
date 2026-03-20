import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopbar } from '@/components/layout/AdminTopbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col ml-64 overflow-hidden relative">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-8 relative">
                {children}
            </main>
        </div>
    </div>
  );
}
