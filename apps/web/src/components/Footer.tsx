import Link from 'next/link';
import type { Locale } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';

interface FooterProps {
    locale: Locale;
    dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
    const column1 = [
        { label: dict.nav.port, href: `/${locale}/le-port` },
        { label: dict.nav.infrastructure, href: `/${locale}/infrastructures` },
        { label: dict.nav.services, href: `/${locale}/services` },
    ];

    const column2 = [
        { label: dict.news.title, href: `/${locale}/actualites` },
        { label: dict.nav.tenders, href: `/${locale}/appels-offres` },
        { label: dict.nav.documentation, href: `/${locale}/documentation` },
    ];

    const legalLinks = [
        { label: dict.footer.legalNotice, href: `/${locale}/mentions-legales` },
        { label: dict.footer.privacyPolicy, href: `/${locale}/politique-confidentialite` },
        { label: 'Cookies', href: '#' },
    ];

    return (
        <footer className="bg-pan-navy text-white">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* About / Logo */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl w-fit">
                            <img src="/logo-pan.png" alt="PAN Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <p className="text-pan-light/60 text-sm leading-relaxed mb-6">
                            {dict.footer.description}
                        </p>
                        {/* Social icons placeholder */}
                        <div className="flex items-center gap-3">
                            {['facebook', 'twitter', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 bg-white/5 hover:bg-pan-gold/20 border border-white/10 rounded-lg flex items-center justify-center text-pan-light/60 hover:text-pan-gold transition-all duration-200"
                                    aria-label={social}
                                >
                                    <span className="text-xs font-bold uppercase">{social.charAt(0)}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 1 */}
                    <div>
                        <h3 className="font-semibold text-pan-gold text-sm mb-5 uppercase tracking-wider">
                            {dict.hero.title}
                        </h3>
                        <ul className="space-y-2.5">
                            {column1.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-pan-light/60 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 bg-pan-gold/40 rounded-full shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="font-semibold text-pan-gold text-sm mb-5 uppercase tracking-wider">
                            {dict.footer.quickLinks}
                        </h3>
                        <ul className="space-y-2.5">
                            {column2.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-pan-light/60 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 bg-pan-gold/40 rounded-full shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-pan-gold text-sm mb-5 uppercase tracking-wider">
                            {dict.footer.contact}
                        </h3>
                        <ul className="space-y-3 text-pan-light/60 text-sm">
                            <li className="flex items-start gap-2.5">
                                <svg className="w-4 h-4 mt-0.5 shrink-0 text-pan-gold/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span>{dict.footer.address}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 shrink-0 text-pan-gold/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <div>
                                    <a href={`tel:${dict.footer.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors block">{dict.footer.phone}</a>
                                    <span className="text-pan-light/40 text-xs">Fax: {dict.footer.fax}</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 shrink-0 text-pan-gold/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <a href={`mailto:${dict.footer.email}`} className="hover:text-white transition-colors">{dict.footer.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-pan-light/40 text-xs text-center sm:text-start">
                            <p>
                                {dict.footer.rights}
                            </p>
                            <span className="hidden sm:inline">-</span>
                            <p>
                                {{
                                    ar: 'تصميم وبرمجة',
                                    fr: 'Design & Développement',
                                    en: 'Design & Development',
                                    es: 'Diseño y Desarrollo'
                                }[locale]}{' '}
                                <a href="https://afrikyia.com" target="_blank" rel="noopener noreferrer" className="text-pan-gold hover:text-pan-gold-light transition-colors font-medium">
                                    Afrikyia
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {legalLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-pan-light/40 text-xs hover:text-pan-light/70 transition-colors"
                                >
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
