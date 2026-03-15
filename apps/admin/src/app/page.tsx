'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, FileText, Newspaper, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PortalSelectorPage() {
    const { isAuthenticated, session } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else {
            router.replace('/cms');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated || !session) return null;

    return (
        <div className="min-h-screen bg-[#060914] flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
    );
}
