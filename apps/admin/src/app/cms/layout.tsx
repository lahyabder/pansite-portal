'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CMSSidebar } from '@/components/PortalSidebars';
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
                <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between shrink-0 bg-[#0a0f1d]/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="text-white/40 text-xs font-mono uppercase tracking-widest">Zone / Site Content</div>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <div className="text-sm font-medium">Dashboard Public</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-pan-gold/10 text-pan-gold border border-pan-gold/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Admin Mode
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
