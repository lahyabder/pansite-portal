'use client';

import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@pan/shared';

export function AdminTopbar() {
    const pathname = usePathname();
    const { t, locale, setLocale } = useI18n();

    const getTitle = () => {
        if (pathname === '/') return t.topbar.titles.dashboard;
        if (pathname === '/contents') return t.topbar.titles.contents;
        if (pathname === '/contents/create') return t.topbar.titles.newContent;
        if (pathname === '/documents') return t.topbar.titles.documents;
        if (pathname === '/documents/create') return t.topbar.titles.newDocument;
        if (pathname === '/medias') return t.topbar.titles.media;
        if (pathname === '/services') return t.topbar.titles.services;
        if (pathname === '/requests') return t.topbar.titles.requests;
        if (pathname === '/tenders') return t.topbar.titles.tenders;
        if (pathname === '/users') return t.topbar.titles.users;
        if (pathname === '/analytics') return t.topbar.titles.analytics;
        if (pathname === '/audit') return t.topbar.titles.audit;
        if (pathname === '/settings') return t.topbar.titles.settings;

        if (pathname.includes('/documents/') && pathname.includes('/versions')) return t.topbar.titles.versionHistory;
        if (pathname.includes('/documents/') && pathname.includes('/edit')) return t.topbar.titles.editDocument;
        if (pathname.includes('/contents/') && pathname.includes('/edit')) return t.topbar.titles.editContent;

        return 'PAN Admin';
    };

    const languages: { code: Locale; label: string; flag: string }[] = [
        { code: 'ar', label: 'العربية', flag: '🇲🇷' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
    ];

    return (
        <header className="h-16 bg-admin-surface border-b border-admin-border flex items-center px-6 justify-between shrink-0">
            <h1 className="text-admin-text font-semibold">{getTitle()}</h1>
            <div className="flex items-center gap-6">

                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <div className="flex items-center bg-admin-surface-alt rounded-lg p-1 border border-admin-border overflow-hidden">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLocale(lang.code)}
                                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${locale === lang.code ? 'bg-admin-primary text-white shadow-sm' : 'text-admin-text-muted hover:text-admin-text'}`}
                                title={lang.label}
                            >
                                {lang.code.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Notifications bell */}
                    <button className="relative p-2 text-admin-text-muted hover:text-admin-text hover:bg-admin-surface-alt rounded-lg transition-colors" title={t.topbar.notifications}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                        <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-admin-danger rounded-full" />
                    </button>
                    <span className="text-admin-text-muted text-sm hidden lg:block">{t.topbar.portName}</span>
                </div>
            </div>
        </header>
    );
}
