'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GEDSidebar } from '@/components/PortalSidebars';
import { AdminTopbar } from '@/components/AdminTopbar';
import { ShieldCheck } from 'lucide-react';

export default function GEDLayout({
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
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="text-white/20 text-sm animate-pulse">Session validation...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-white">
            <GEDSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
