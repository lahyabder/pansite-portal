'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, session } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-admin-bg">
                <div className="text-admin-text-muted text-sm animate-pulse">Vérification de la session...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
