'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GEDSidebar } from '@/components/PortalSidebars';
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
                <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between shrink-0 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Zone / Archives</div>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <div className="text-sm font-medium">Gestion Documentaire</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-pan-blue/10 text-pan-sky border border-pan-blue/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Secure Vault
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
