import type { Locale } from '@pan/shared';
import { t, formatDate } from '@pan/shared';
import { mockServices, mockStatistics, getLatestContents } from '@pan/shared';

export const dynamic = 'force-dynamic';

import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { AlertBar } from '@/components/AlertBar';
import { HeroSlider } from '@/components/HeroSlider';
import { Ship, Anchor, Building2, FileText, Calendar, Phone, TrendingUp, ShipWheel } from 'lucide-react';

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    const latestContent = getLatestContents(6);

    const categoryColors: Record<string, string> = {
        actualite: 'bg-pan-blue text-white',
        communique: 'bg-pan-sky text-white',
        evenement: 'bg-pan-gold text-pan-navy',
        alerte: 'bg-red-500 text-white',
    };

    const categoryRoute: Record<string, string> = {
        actualite: 'actualites',
        communique: 'communiques',
        evenement: 'evenements',
        alerte: 'alertes',
    };

    const quickServices = [
        { title: dict.nav.services, icon: Ship, href: `/${locale}/services` },
        { title: dict.nav.tenders, icon: FileText, href: `/${locale}/appels-offres` },
        { title: dict.nav.tariffs, icon: TrendingUp, href: `/${locale}/tarifs` },
        { title: dict.nav.documentation, icon: Building2, href: `/${locale}/documentation` },
        { title: dict.nav.stopovers, icon: Anchor, href: `/${locale}/escales` },
        { title: dict.nav.contact, icon: Phone, href: `/${locale}/contact` },
    ];

    return (
        <>
            <AlertBar locale={locale} dict={dict} />

            {/* ═══ Hero Slider Section ═══ */}
            <HeroSlider dict={dict} locale={locale} />


            {/* ═══ Key Figures (Chiffres Clés) ═══ */}
            <section id="statistics" className="relative z-10 -mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-2 lg:grid-cols-4 border border-pan-gray-100">
                        {mockStatistics.map((stat, i) => (
                            <div key={stat.id} className={`p-8 text-center group ${i !== 3 ? 'border-e border-pan-gray-100' : ''}`}>
                                <div className="w-12 h-12 bg-pan-pale rounded-full mx-auto flex items-center justify-center text-pan-blue mb-4 group-hover:bg-pan-blue group-hover:text-white transition-colors duration-300">
                                    <BarChartIcon i={i} />
                                </div>
                                <div className="text-3xl sm:text-4xl font-bold text-pan-navy mb-2 group-hover:scale-105 transition-transform duration-300">
                                    {stat.value.toLocaleString('en-US')}
                                    {stat.unit && (
                                        <span className="text-lg text-pan-gray-500 ms-1">{stat.unit}</span>
                                    )}
                                </div>
                                <div className="text-pan-gray-600 font-medium text-sm lg:text-base">{t(stat.label, locale)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Quick Access Services ═══ */}
            <section id="quick-services" className="py-24 bg-pan-pale">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-pan-navy mb-4">
                            {{
                                ar: 'وصول سريع',
                                fr: 'Accès Rapide',
                                en: 'Quick Access',
                                es: 'Acceso Rápido'
                            }[locale]}
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                        {quickServices.map((qs, i) => (
                            <Link
                                href={qs.href}
                                key={i}
                                className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl border border-pan-gray-100 hover:border-pan-blue transition-all duration-300 flex flex-col items-center justify-center text-center hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-pan-pale flex items-center justify-center text-pan-navy mb-6 group-hover:bg-pan-gold group-hover:text-pan-navy transition-colors duration-300">
                                    <qs.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-pan-navy group-hover:text-pan-blue transition-colors">
                                    {qs.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Latest Content ═══ */}
            <section id="news" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-16">
                        <div>
                            <div className="w-16 h-1 bg-pan-gold rounded-full mb-6" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-pan-navy mb-4">
                                {dict.news.title}
                            </h2>
                            <p className="text-lg text-pan-gray-500 max-w-2xl">
                                {dict.news.subtitle}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/actualites`}
                            className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-pan-navy text-white font-medium rounded-lg hover:bg-pan-blue transition-colors"
                        >
                            {dict.news.viewAll}
                            <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestContent.map((article) => (
                            <article
                                key={article.id}
                                className="group bg-pan-pale rounded-2xl overflow-hidden border border-pan-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-48 bg-pan-navy relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-pan-blue/20 group-hover:bg-pan-blue/10 transition-colors duration-300 z-10" />

                                    {/* Image Rendering */}
                                    {article.images && article.images.length > 0 ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={article.images[0]}
                                            alt={t(article.title, locale)}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                    ) : article.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={article.coverImage}
                                            alt={t(article.title, locale)}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                    ) : (
                                        <ShipWheel className="w-20 h-20 text-white/10" />
                                    )}

                                    {article.priority === 'urgent' && (
                                        <div className="absolute top-3 end-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full animate-pulse uppercase tracking-wider">
                                            {{
                                                ar: 'عاجل',
                                                fr: 'Urgent',
                                                en: 'Urgent',
                                                es: 'Urgente'
                                            }[locale]}
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 start-4 flex items-center gap-2">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md ${categoryColors[article.category] || 'bg-white text-pan-navy'}`}>
                                            {dict.content.categories[article.category]}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs font-semibold text-pan-sky mb-3">
                                        {article.publishedAt && formatDate(article.publishedAt, locale)}
                                    </div>
                                    <h3 className="text-xl font-bold text-pan-navy mb-3 group-hover:text-pan-blue transition-colors duration-300 line-clamp-2">
                                        {t(article.title, locale)}
                                    </h3>
                                    <p className="text-pan-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {t(article.excerpt, locale)}
                                    </p>
                                    <Link
                                        href={`/${locale}/${categoryRoute[article.category] || 'actualites'}/${article.slug}`}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-pan-gray-200 text-pan-navy font-semibold text-sm rounded-lg hover:border-pan-blue hover:text-pan-blue transition-all"
                                    >
                                        {dict.news.readMore}
                                        <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

function BarChartIcon({ i }: { i: number }) {
    if (i === 0) return <TrendingUp className="w-6 h-6" />;
    if (i === 1) return <Ship className="w-6 h-6" />;
    if (i === 2) return <Building2 className="w-6 h-6" />;
    return <Anchor className="w-6 h-6" />;
}
