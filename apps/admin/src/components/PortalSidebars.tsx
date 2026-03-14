'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { LayoutDashboard, Newspaper, Ship, Settings, BarChart, Users, FileText, FileImage as Image, ClipboardList, LogOut } from 'lucide-react';

export function CMSSidebar() {
    const pathname = usePathname();
    const { session, logout } = useAuth();
    const { t, locale } = useI18n();

    const menu = [
        {
            title: t.sidebar.principal, items: [
                { icon: LayoutDashboard, label: t.sidebar.dashboard, href: '/cms' },
            ]
        },
        {
            title: t.sidebar.siteContent, items: [
                { icon: Newspaper, label: t.sidebar.contents, href: '/cms/contents' },
                { icon: Ship, label: t.sidebar.port, href: '/cms/contents?category=le-port' },
                { icon: LayoutDashboard, label: t.sidebar.infrastructure, href: '/cms/contents?category=infrastructure' },
                { icon: ClipboardList, label: t.sidebar.services, href: '/cms/contents?category=services' },
                { icon: FileText, label: t.sidebar.procedures, href: '/cms/contents?category=procedures' },
                { icon: BarChart, label: t.sidebar.tariffs, href: '/cms/contents?category=tariffs' },
                { icon: Ship, label: t.sidebar.stopovers, href: '/cms/contents?category=stopovers' },
                { icon: ClipboardList, label: t.sidebar.tenders, href: '/cms/contents?category=tenders' },
                { icon: FileText, label: t.sidebar.documentation, href: '/cms/contents?category=documentation' },
                { icon: Image, label: t.sidebar.media, href: '/cms/contents?category=media' },
                { icon: Users, label: t.sidebar.contact, href: '/cms/contents?category=contact' },
            ]
        },
        {
            title: t.sidebar.administration, items: [
                { icon: Users, label: t.sidebar.users, href: '/cms/users' },
                { icon: BarChart, label: t.sidebar.analytics, href: '/cms/analytics' },
                { icon: Settings, label: t.sidebar.settings, href: '/cms/settings' },
            ]
        },
    ];

    const isActive = (href: string) => {
        if (href === '/cms') return pathname === '/cms';
        return pathname.startsWith(href);
    };

    return (
        <aside className={`w-64 bg-[#0a0f1d] border-e border-white/5 flex flex-col shrink-0 h-screen sticky top-0 text-white ${locale === 'ar' ? 'font-arabic' : ''}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pan-gold rounded-xl flex items-center justify-center shadow-lg shadow-pan-gold/20">
                        <LayoutDashboard className="w-6 h-6 text-pan-navy" />
                    </div>
                    <div>
                        <div className="font-bold text-sm tracking-tight">{t.topbar.portName}</div>
                        <div className="text-[10px] text-pan-gold font-semibold uppercase">{t.sidebar.dashboard}</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-8 pt-4">
                {menu.map(section => (
                    <div key={section.title}>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4 mb-4">
                            {section.title}
                        </div>
                        <div className="space-y-1">
                            {section.items.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive(item.href)
                                        ? 'bg-pan-gold text-pan-navy font-bold shadow-lg shadow-pan-gold/10'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-pan-navy' : 'text-white/40'}`} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className={`p-4 border-t border-white/5 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    {t.sidebar.logout}
                </button>
            </div>
        </aside>
    );
}

export function GEDSidebar() {
    const pathname = usePathname();
    const { session, logout } = useAuth();

    const menu = [
        {
            title: 'GED', items: [
                { icon: LayoutDashboard, label: 'Aperçu Global', href: '/ged' },
                { icon: FileText, label: 'Bibliothèque Centrale', href: '/ged/documents' },
            ]
        },
        {
            title: 'Workflow', items: [
                { icon: ClipboardList, label: 'Demandes de documents', href: '/ged/requests' },
                { icon: BarChart, label: 'Journal d\'audit', href: '/ged/audit' },
            ]
        },
    ];

    const isActive = (href: string) => {
        if (href === '/ged') return pathname === '/ged';
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 bg-[#0f172a] border-e border-white/5 flex flex-col shrink-0 h-screen sticky top-0 text-white">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pan-blue rounded-xl flex items-center justify-center shadow-lg shadow-pan-blue/20">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-sm tracking-tight">Portail GED</div>
                        <div className="text-[10px] text-pan-sky font-semibold uppercase">Management</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-8 pt-4">
                {menu.map(section => (
                    <div key={section.title}>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4 mb-4">
                            {section.title}
                        </div>
                        <div className="space-y-1">
                            {section.items.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive(item.href)
                                        ? 'bg-pan-blue text-white font-bold shadow-lg shadow-pan-blue/10'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-white/40'}`} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}
