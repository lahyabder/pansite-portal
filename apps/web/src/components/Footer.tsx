import Link from 'next/link';
import Image from 'next/image';
import type { Locale, SiteSettings, Menu } from '@pan/shared';
import { t } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';

interface FooterProps {
    locale: Locale;
    dict: Dictionary;
    menu: Menu | null;
    settings: SiteSettings | null;
}

export function Footer({ locale, dict, menu, settings }: FooterProps) {
    // Basic mapping for menu items if dynamic menu exists
    const menuItems = menu?.items.map(item => ({
        label: t(item.label, locale),
        href: item.href.startsWith('http') ? item.href : `/${locale}${item.href}`
    })) || [];

    // Split menu items into two columns if many, or use defaults
    const column1 = menuItems.length > 0 ? menuItems.slice(0, Math.ceil(menuItems.length / 2)) : [
        { label: dict.nav.port, href: `/${locale}/le-port` },
        { label: dict.nav.infrastructure, href: `/${locale}/infrastructures` },
        { label: dict.nav.services, href: `/${locale}/services` },
        { label: dict.nav.media, href: `/${locale}/medias` },
    ];

    const column2 = menuItems.length > 0 ? menuItems.slice(Math.ceil(menuItems.length / 2)) : [
        { label: dict.news.title, href: `/${locale}/actualites` },
        { label: dict.nav.contact, href: `/${locale}/contact` },
    ];

    const legalLinks = [
        { label: dict.footer.legalNotice, href: `/${locale}/mentions-legales` },
        { label: dict.footer.privacyPolicy, href: `/${locale}/politique-confidentialite` },
    ];

    const socialLinks = settings?.socialLinks || {};

    return (
        <footer className="bg-pan-navy text-white">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* About / Logo */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl w-fit">
                            <Image src="/logo-horizontal.png" alt={t(settings?.siteName, locale) || 'PAN'} width={180} height={48} className="h-12 w-auto object-contain transition-opacity hover:opacity-80" />
                        </div>
                        <p className="text-pan-light/60 text-sm leading-relaxed mb-6 italic">
                            {t(settings?.slogan, locale) || dict.footer.description}
                        </p>
                        <div className="flex items-center gap-3">
                            {Object.entries(socialLinks).map(([platform, url]) => (
                                url && (
                                    <a
                                        key={platform}
                                        href={url as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-white/5 hover:bg-pan-gold/20 border border-white/10 rounded-xl flex items-center justify-center text-pan-light/60 hover:text-pan-gold transition-all duration-300"
                                        aria-label={platform}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{platform.slice(0, 2)}</span>
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h3 className="font-bold text-pan-gold text-[10px] mb-6 uppercase tracking-[0.2em]">
                            {'Explorer'}
                        </h3>
                        <ul className="space-y-3">
                            {column1.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-pan-light/60 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pan-gold/20 group-hover:bg-pan-gold rounded-full transition-colors" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-pan-gold text-[10px] mb-6 uppercase tracking-[0.2em]">
                            {dict.footer.quickLinks}
                        </h3>
                        <ul className="space-y-3">
                            {column2.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-pan-light/60 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-pan-gold/20 group-hover:bg-pan-gold rounded-full transition-colors" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-pan-gold text-[10px] mb-6 uppercase tracking-[0.2em]">
                            {dict.footer.contact}
                        </h3>
                        <ul className="space-y-4 text-pan-light/70 text-sm">
                            <li className="flex items-start gap-3">
                                <svg className="w-4 h-4 mt-1 shrink-0 text-pan-gold/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>{t(settings?.address, locale) || dict.footer.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-4 h-4 shrink-0 text-pan-gold/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <a href={`tel:${settings?.contactPhones?.[0]?.replace(/\s/g, '')}`} className="hover:text-white transition-colors"><span dir="ltr">{settings?.contactPhones?.[0] || dict.footer.phone}</span></a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-4 h-4 shrink-0 text-pan-gold/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <a href={`mailto:${settings?.contactEmails?.[0]}`} className="hover:text-white transition-colors uppercase text-xs font-bold">{settings?.contactEmails?.[0] || dict.footer.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 bg-black/10">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col items-center md:items-start gap-1 text-[10px] text-pan-light/30 uppercase font-black tracking-widest">
                            <p>© {new Date().getFullYear()} {t(settings?.siteName, locale) || 'PAN'} - {t(settings?.copyright, locale) || dict.footer.rights}</p>
                            <p className="flex items-center gap-1.5 opacity-50">
                                Powered by <a href="https://afrikyia.com" target="_blank" className="text-pan-gold hover:text-white transition-colors">Afrikyia</a>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {legalLinks.map((item) => (
                                <Link key={item.href} href={item.href} className="text-[10px] text-pan-light/30 hover:text-white transition-colors font-bold uppercase tracking-widest">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
