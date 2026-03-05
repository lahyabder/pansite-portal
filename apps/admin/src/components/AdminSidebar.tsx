'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { PermissionModule } from '@pan/shared';
import { ROLE_LABELS } from '@pan/shared';

interface NavItem {
    icon: string;
    label: string;
    href: string;
    module?: PermissionModule;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: 'Principal',
        items: [
            { icon: '📊', label: 'Tableau de bord', href: '/' },
        ],
    },
    {
        title: 'Contenu',
        items: [
            { icon: '📰', label: 'Contenus', href: '/contents', module: 'content' },
            { icon: '📁', label: 'Documents GED', href: '/documents', module: 'documents' },
            { icon: '🖼️', label: 'Médias', href: '/medias', module: 'content' },
        ],
    },
    {
        title: 'Opérationnel',
        items: [
            { icon: '🚢', label: 'Services', href: '/services', module: 'services' },
            { icon: '📩', label: 'Demandes', href: '/requests', module: 'requests' },
            { icon: '📋', label: 'Appels d\'offres', href: '/tenders', module: 'services' },
        ],
    },
    {
        title: 'Administration',
        items: [
            { icon: '👥', label: 'Utilisateurs', href: '/users', module: 'users' },
            { icon: '📈', label: 'Analytique', href: '/analytics', module: 'analytics' },
            { icon: '📜', label: 'Journal d\'audit', href: '/audit', module: 'audit' },
            { icon: '⚙️', label: 'Paramètres', href: '/settings', module: 'settings' },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { session, logout, canAny } = useAuth();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const user = session?.user;
    const initials = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '??';

    return (
        <aside className="w-64 bg-admin-surface border-e border-admin-border flex flex-col shrink-0 h-screen sticky top-0">
            {/* Logo */}
            <div className="p-5 border-b border-admin-border">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-admin-accent rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                        <span className="text-admin-bg font-bold">P</span>
                    </div>
                    <div>
                        <div className="text-admin-text font-bold text-sm">PAN Admin</div>
                        <div className="text-admin-text-muted text-[10px]">Back Office</div>
                    </div>
                </Link>
            </div>

            {/* Navigation — filtered by RBAC */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {navSections.map((section) => {
                    const visibleItems = section.items.filter(item =>
                        !item.module || canAny(item.module)
                    );
                    if (visibleItems.length === 0) return null;
                    return (
                        <div key={section.title}>
                            <div className="text-admin-text-muted text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                                {section.title}
                            </div>
                            <div className="space-y-0.5">
                                {visibleItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive(item.href)
                                            ? 'bg-admin-primary/15 text-admin-primary-light font-medium'
                                            : 'text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-alt'
                                            }`}
                                    >
                                        <span className="text-base w-5 text-center">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* User + role badge */}
            <div className="p-4 border-t border-admin-border">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-admin-primary rounded-full flex items-center justify-center relative">
                        <span className="text-white text-xs font-bold">{initials}</span>
                        {user?.twoFactorEnabled && (
                            <span className="absolute -top-0.5 -end-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-admin-surface" title="2FA activé" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-admin-text text-sm font-medium truncate">{user?.name ?? '...'}</div>
                        <div className="text-admin-text-muted text-[10px]">{user ? ROLE_LABELS[user.role] : ''}</div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-1.5 text-admin-text-muted hover:text-admin-danger transition-colors rounded-lg hover:bg-admin-surface-alt"
                        title="Déconnexion"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
