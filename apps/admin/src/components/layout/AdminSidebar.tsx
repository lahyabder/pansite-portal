'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, FileText, Newspaper, FileBox, 
    Briefcase, ShieldCheck, DollarSign, Anchor, Image as ImageIcon, 
    MessageSquare, Menu, Users, Shield, Settings, Activity
} from 'lucide-react';

const navGroups = [
    {
        label: 'Principal',
        items: [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
        ]
    },
    {
        label: 'Contenu du Site',
        items: [
            { href: '/pages', label: 'Pages Statiques', icon: FileText },
            { href: '/news', label: 'Actualités', icon: Newspaper },
            { href: '/tenders', label: 'Appels d\'offres', icon: FileBox },
            { href: '/services', label: 'Services', icon: Briefcase },
            { href: '/procedures', label: 'Procédures', icon: ShieldCheck },
            { href: '/tariffs', label: 'Tarifs', icon: DollarSign },
            { href: '/berthing', label: 'Escales', icon: Anchor },
            { href: '/media', label: 'Médiathèque', icon: ImageIcon },
        ]
    },
    {
        label: 'Interactions',
        items: [
            { href: '/messages', label: 'Messages de contact', icon: MessageSquare },
        ]
    },
    {
        label: 'Système & Sécurité',
        items: [
            { href: '/menus', label: 'Menus', icon: Menu },
            { href: '/users', label: 'Utilisateurs', icon: Users },
            { href: '/roles', label: 'Rôles & Permissions', icon: Shield },
            { href: '/settings', label: 'Paramètres du site', icon: Settings },
            { href: '/activity-log', label: 'Journal d\'activité', icon: Activity },
        ]
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-pan-navy text-white flex-shrink-0 flex flex-col h-screen fixed top-0 left-0 overflow-y-auto border-r border-[#1e293b]">
            <div className="p-6 border-b border-white/5 sticky top-0 bg-pan-navy/95 backdrop-blur z-10">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-pan-gold flex items-center justify-center text-pan-navy font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <div>
                        <h1 className="font-bold text-[11px] tracking-widest text-white leading-tight uppercase">Port Autonome<br/><span className="text-pan-gold">Nouadhibou</span></h1>
                    </div>
                </Link>
            </div>
            
            <nav className="flex-1 p-4 space-y-8">
                {navGroups.map((group, i) => (
                    <div key={i}>
                        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 px-3">{group.label}</h2>
                        <ul className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link 
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-pan-sky/20 text-pan-sky' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-pan-sky' : 'text-white/40'}`} />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
            
            <div className="p-4 border-t border-white/5 mt-auto">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Système v2.0.0</p>
                    <p className="text-[10px] text-pan-sky font-bold uppercase tracking-wider">Back-Office Institutionnel</p>
                </div>
            </div>
        </aside>
    );
}
