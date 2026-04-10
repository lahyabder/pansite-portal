'use client';

import { Bell, Search, Globe, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function AdminTopbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    // Basic breadcrumb title logic
    const segments = pathname.split('/').filter(Boolean);
    const title = segments.length > 0 
        ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1).replace('-', ' ')
        : 'Dashboard';

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="h-20 bg-white shadow-sm shadow-pan-navy/5 flex items-center justify-between px-8 sticky top-0 z-20">
            <div>
                <h1 className="text-2xl font-bold text-pan-navy">{title}</h1>
                <p className="text-[10px] text-pan-gray-400 mt-1 uppercase tracking-widest font-bold">
                    <span>Admin</span> {segments.length > 0 && <span className="mx-2">/</span>} <span className="text-pan-sky">{title}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-pan-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        className="pl-10 pr-4 py-2 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>
                
                <div className="h-8 w-px bg-pan-gray-200 hidden md:block" />
                
                <button className="relative text-pan-gray-500 hover:text-pan-navy transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                
                <button className="flex items-center gap-2 text-pan-gray-500 hover:text-pan-navy transition-colors text-sm font-bold">
                    <Globe className="w-4 h-4" />
                    FR
                </button>
                
                <div className="h-8 w-px bg-pan-gray-200" />
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pan-navy text-white flex items-center justify-center font-bold">
                        A
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-pan-navy leading-tight">Admin User</p>
                        <p className="text-[10px] uppercase font-bold text-pan-sky tracking-wider">Super Admin</p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="ml-4 p-2 text-pan-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Se déconnecter"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
