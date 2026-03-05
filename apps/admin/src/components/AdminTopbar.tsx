'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
    '/': 'Tableau de bord',
    '/contents': 'Gestion des Contenus',
    '/contents/create': 'Nouveau Contenu',
    '/documents': 'Documents GED',
    '/documents/create': 'Nouveau Document',
    '/medias': 'Gestion des Médias',
    '/services': 'Catalogue des Services',
    '/requests': 'File des demandes',
    '/tenders': 'Appels d\'Offres',
    '/users': 'Utilisateurs & Rôles',
    '/analytics': 'Analytique',
    '/audit': 'Journal d\'audit',
    '/settings': 'Paramètres',
};

export function AdminTopbar() {
    const pathname = usePathname();
    const title = pageTitles[pathname]
        || (pathname.includes('/documents/') && pathname.includes('/versions') ? 'Historique des versions' : null)
        || (pathname.includes('/documents/') && pathname.includes('/edit') ? 'Modifier le document' : null)
        || (pathname.includes('/contents/') && pathname.includes('/edit') ? 'Modifier le Contenu' : null)
        || Object.entries(pageTitles).find(([k]) => k !== '/' && pathname.startsWith(k))?.[1]
        || 'PAN Admin';

    return (
        <header className="h-16 bg-admin-surface border-b border-admin-border flex items-center px-6 justify-between shrink-0">
            <h1 className="text-admin-text font-semibold">{title}</h1>
            <div className="flex items-center gap-4">
                {/* Notifications bell */}
                <button className="relative p-2 text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-alt rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-admin-danger rounded-full" />
                </button>
                <span className="text-admin-text-muted text-sm hidden md:block">Port Autonome de Nouadhibou</span>
            </div>
        </header>
    );
}
