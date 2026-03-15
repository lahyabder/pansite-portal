'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CMSSidebar } from '@/components/PortalSidebars';
import { AdminTopbar } from '@/components/AdminTopbar';
import { Shield } from 'lucide-react';

export default function CMSLayout({
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
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
                <div className="text-white/20 text-sm animate-pulse">Vérification de la session...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#060914] text-white">
            <CMSSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
