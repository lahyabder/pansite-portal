'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';

interface HeaderProps {
    locale: Locale;
    dict: Dictionary;
}

interface NavGroup {
    label: string;
    href: string;
    children?: { label: string; href: string }[];
}

export function Header({ locale, dict }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const locales: { code: Locale; label: string; short: string }[] = [
        { code: 'ar', label: 'العربية', short: 'AR' },
        { code: 'fr', label: 'Français', short: 'FR' },
        { code: 'en', label: 'English', short: 'EN' },
        { code: 'es', label: 'Español', short: 'ES' },
    ];

    const navGroups: NavGroup[] = [
        { label: dict.nav.home, href: `/${locale}` },
        { label: dict.nav.port, href: `/${locale}/le-port` },
        { label: dict.nav.infrastructure, href: `/${locale}/infrastructures` },
        { label: dict.nav.services, href: `/${locale}/services` },
        { label: dict.nav.procedures, href: `/${locale}/procedures` },
        { label: dict.nav.tariffs, href: `/${locale}/tarifs` },
        { label: dict.nav.stopovers, href: `/${locale}/escales` },
        { label: dict.nav.tenders, href: `/${locale}/appels-offres` },
        { label: dict.nav.documentation, href: `/${locale}/documentation` },
        { label: dict.nav.media, href: `/${locale}/medias` },
        { label: dict.nav.contact, href: `/${locale}/contact` },
    ];

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
    }, [pathname]);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    return (
        <>
            {/* ─── Top Info Bar ─── */}
            <div className="bg-pan-navy text-white text-xs hidden lg:block">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-pan-light/70" dir="ltr">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            +222 45 74 51 06
                        </span>
                        <span className="flex items-center gap-1.5 text-pan-light/70">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            contact@pan.mr
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2" translate="no">
                            {locales.map((l) => (
                                <Link
                                    key={l.code}
                                    href={pathname.replace(`/${locale}`, `/${l.code}`)}
                                    className={`px-2 py-0.5 border rounded text-[10px] font-semibold transition-colors ${locale === l.code
                                        ? 'bg-white text-pan-navy border-white'
                                        : 'border-white/20 hover:bg-white/10'
                                        }`}
                                >
                                    {l.short}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Header ─── */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pan-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16 lg:h-[72px]">
                        {/* Logo */}
                        <Link href={`/${locale}`} className="flex items-center gap-3 group shrink-0">
                            <img src="/logo-pan.png" alt="Port Autonome de Nouadhibou" className="h-10 lg:h-12 w-auto object-contain" />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 lg:mx-2 xl:mx-4">
                            {navGroups.map((group) => (
                                <div
                                    key={group.href}
                                    className="relative"
                                    onMouseEnter={() => group.children && setOpenDropdown(group.href)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <Link
                                        href={group.href}
                                        className={`px-1.5 xl:px-3 py-2 text-[10px] xl:text-[13px] font-medium rounded-lg transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${isActive(group.href)
                                            ? 'text-pan-sky bg-pan-pale'
                                            : 'text-pan-gray-600 hover:text-pan-navy hover:bg-pan-gray-50'
                                            }`}
                                    >
                                        {group.label}
                                        {group.children && (
                                            <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        )}
                                    </Link>

                                    {/* Dropdown */}
                                    {group.children && openDropdown === group.href && (
                                        <div className="absolute top-full start-0 pt-1 z-50">
                                            <div className="bg-white rounded-xl shadow-xl border border-pan-gray-100 py-2 min-w-[200px]">
                                                {group.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={`block px-4 py-2.5 text-sm transition-colors ${isActive(child.href)
                                                            ? 'text-pan-sky bg-pan-pale'
                                                            : 'text-pan-gray-600 hover:text-pan-navy hover:bg-pan-gray-50'
                                                            }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Right side: Search + Lang + Mobile Toggle */}
                        <div className="flex items-center gap-2">
                            {/* Search toggle */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2.5 text-pan-gray-500 hover:text-pan-navy hover:bg-pan-gray-50 rounded-lg transition-all"
                                aria-label={dict.nav.search}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>

                            {/* Language switcher (Desktop + Mobile) */}
                            <div className="flex items-center gap-1 border border-pan-gray-200 rounded-lg overflow-hidden shrink-0" translate="no">
                                {locales.map((l) => (
                                    <Link
                                        key={l.code}
                                        href={pathname.replace(`/${locale}`, `/${l.code}`)}
                                        className={`px-2 py-1.5 text-[10px] font-bold transition-all ${locale === l.code
                                            ? 'bg-pan-navy text-white'
                                            : 'text-pan-navy hover:bg-pan-pale'
                                            }`}
                                    >
                                        {l.short}
                                    </Link>
                                ))}
                            </div>

                            {/* CTA Accès Port */}
                            <a
                                href="https://admin.pan.afrikyia.com"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-pan-gold text-pan-navy text-xs font-bold rounded-lg hover:bg-pan-gold-light transition-all shadow-sm shrink-0"
                            >
                                {({
                                    ar: 'بوابة الميناء',
                                    fr: 'Accès Port',
                                    en: 'Port Portal',
                                    es: 'Portal del Puerto'
                                } as Record<string, string>)[locale]}
                            </a>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-pan-gray-600 hover:text-pan-navy hover:bg-pan-gray-50 rounded-lg transition-all"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar (expandable) */}
                    {searchOpen && (
                        <div className="pb-4 border-t border-pan-gray-100 pt-4 animate-in slide-in-from-top-2 duration-200">
                            <form action={`/${locale}/search`} method="get" className="relative max-w-2xl mx-auto">
                                <svg className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pan-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    name="q"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={dict.nav.searchPlaceholder}
                                    className="w-full ps-12 pe-4 py-3 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-pan-gray-400 hover:text-pan-gray-600"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Mobile Nav */}
                    {mobileMenuOpen && (
                        <nav className="lg:hidden pb-4 border-t border-pan-gray-100 pt-4">
                            <div className="flex flex-col gap-0.5 max-h-[70vh] overflow-y-auto">
                                {navGroups.map((group) => (
                                    <div key={group.href}>
                                        <Link
                                            href={group.href}
                                            className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive(group.href)
                                                ? 'text-pan-sky bg-pan-pale'
                                                : 'text-pan-gray-600 hover:text-pan-navy hover:bg-pan-gray-50'
                                                }`}
                                        >
                                            {group.label}
                                        </Link>
                                        {group.children && (
                                            <div className="ms-6 border-s-2 border-pan-gray-100 ps-3">
                                                {group.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={`block px-3 py-2.5 text-sm rounded-lg transition-all ${isActive(child.href)
                                                            ? 'text-pan-sky'
                                                            : 'text-pan-gray-500 hover:text-pan-navy'
                                                            }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
}
