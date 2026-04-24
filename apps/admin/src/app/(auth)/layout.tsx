import { AdminLangProvider } from "@/lib/AdminLangContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLangProvider>
      {children}
    </AdminLangProvider>
  );
}
