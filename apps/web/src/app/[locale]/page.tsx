import type { Locale } from '@pan/shared';
import { t, formatDate, getSiteSettings, getPageBySlug, getLatestContents } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import Image from 'next/image';
import { AlertBar } from '@/components/AlertBar';
import { HeroSlider } from '@/components/HeroSlider';
import { Ship, Anchor, Building2, FileText, Calendar, Phone, TrendingUp, ShipWheel, BarChart3, Globe } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    // Fetch Dynamic Data in Parallel
    const [settings, homePage, latestContent] = await Promise.all([
        getSiteSettings(),
        getPageBySlug('home'),
        getLatestContents(6)
    ]);

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

    // Dynamic Statistics from Home Page blocks or Settings
    const statsBlock = homePage?.blocks?.find(b => b.type === 'features' && b.id === 'stats');
    const displayStats = statsBlock?.content?.items || [
        { label: { fr: 'Trafic Annuel', ar: 'الحركة السنوية' }, value: '1.2M', unit: 'T' },
        { label: { fr: 'Navires / an', ar: 'سفينة / سنة' }, value: '850', unit: '' },
        { label: { fr: 'Espaces stockage', ar: 'مساحات التخزين' }, value: '45k', unit: 'm²' },
        { label: { fr: 'Personnel', ar: 'الموظفون' }, value: '300', unit: '+' },
    ];

    const quickServices = [
        { title: dict.nav.services, icon: Ship, href: `/${locale}/services` },
        { title: dict.nav.tenders, icon: FileText, href: `/${locale}/appels-offres` },
        { title: dict.nav.tariffs, icon: TrendingUp, href: `/${locale}/tarifs` },
        { title: dict.nav.stopovers, icon: Anchor, href: `/${locale}/escales` },
        { title: dict.nav.contact, icon: Phone, href: `/${locale}/contact` },
    ];

    return (
        <div className="relative">
            <AlertBar locale={locale} dict={dict} />

            {/* ═══ Hero Slider Section ═══ */}
            <HeroSlider 
                dict={dict} 
                locale={locale} 
                settings={settings} 
                slides={homePage?.blocks?.find(b => b.type === 'hero')?.content?.slides}
            />

            {/* ═══ Key Figures (Chiffres Clés) ═══ */}
            <section id="statistics" className="relative z-10 -mt-16 lg:-mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-2 lg:grid-cols-4 border border-pan-gray-100 divide-x divide-pan-gray-50 rtl:divide-x-reverse">
                        {displayStats.map((stat, i) => (
                            <div key={i} className="p-10 text-center group hover:bg-pan-navy transition-all duration-500">
                                <div className="w-14 h-14 bg-pan-pale rounded-2xl mx-auto flex items-center justify-center text-pan-blue mb-6 group-hover:bg-pan-gold group-hover:text-pan-navy group-hover:rotate-12 transition-all duration-500">
                                    <BarChartIcon i={i} />
                                </div>
                                <div className="text-4xl lg:text-5xl font-black text-pan-navy mb-2 group-hover:text-white transition-colors">
                                    {stat.value}
                                    {stat.unit && <span className="text-lg font-bold opacity-40 ms-1 uppercase">{stat.unit}</span>}
                                </div>
                                <div className="text-pan-gray-400 font-bold text-xs uppercase tracking-widest group-hover:text-pan-gold transition-colors">
                                    {t(stat.label, locale)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Quick Access Services ═══ */}
            <section id="quick-services" className="py-32 bg-pan-pale/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-20">
                        <span className="text-pan-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4">Portail Services</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-pan-navy mb-6">
                            {dict.quickAccess}
                        </h2>
                        <div className="w-20 h-1 bg-pan-navy rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {quickServices.map((qs, i) => (
                            <Link
                                href={qs.href}
                                key={i}
                                className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl border border-pan-gray-100 hover:border-pan-navy transition-all duration-500 flex flex-col items-center justify-center text-center hover:-translate-y-2"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-pan-pale flex items-center justify-center text-pan-navy mb-8 group-hover:bg-pan-navy group-hover:text-white transition-all duration-500">
                                    <qs.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-pan-navy group-hover:text-pan-gold transition-colors">
                                    {qs.title}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Latest Content ═══ */}
            <section id="news" className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-20">
                        <div className="max-w-2xl">
                            <span className="text-pan-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Actualités & Presse</span>
                            <h2 className="text-4xl lg:text-6xl font-black text-pan-navy mb-8">
                                {dict.news.title}
                            </h2>
                            <p className="text-lg text-pan-gray-400 font-medium">
                                {dict.news.subtitle}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/actualites`}
                            className="hidden sm:inline-flex items-center gap-3 px-8 py-4 bg-pan-navy text-white font-bold rounded-2xl hover:bg-pan-gold hover:text-pan-navy transition-all duration-300 shadow-xl shadow-pan-navy/20"
                        >
                            {dict.news.viewAll}
                            <span aria-hidden="true" className="text-lg">{locale === 'ar' ? '←' : '→'}</span>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {latestContent.map((article) => (
                            <article
                                key={article.id}
                                className="group bg-white rounded-3xl overflow-hidden border border-pan-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="h-64 bg-pan-navy relative overflow-hidden">
                                    <div className="absolute inset-0 bg-pan-navy/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                                    
                                    {article.images?.[0] || article.coverImage ? (
                                        <Image
                                            src={article.images?.[0] || article.coverImage || ''}
                                            alt={t(article.title, locale)}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20">
                                            <ShipWheel className="w-32 h-32 text-white" />
                                        </div>
                                    )}

                                    <div className="absolute top-6 start-6 z-20">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${categoryColors[article.category] || 'bg-white text-pan-navy'}`}>
                                            {dict.content.categories[article.category]}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-pan-gray-300 uppercase tracking-widest mb-4">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {article.publishedAt && formatDate(article.publishedAt, locale)}
                                    </div>
                                    <h3 className="text-2xl font-black text-pan-navy mb-4 group-hover:text-pan-gold transition-colors line-clamp-2">
                                        {t(article.title, locale)}
                                    </h3>
                                    <p className="text-pan-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                                        {t(article.excerpt, locale)}
                                    </p>
                                    <Link
                                        href={`/${locale}/${categoryRoute[article.category] || 'actualites'}/${article.slug}`}
                                        className="inline-flex items-center gap-2 group/btn text-pan-navy font-black text-xs uppercase tracking-widest hover:text-pan-gold transition-colors"
                                    >
                                        {dict.news.readMore}
                                        <span aria-hidden="true" className="group-hover/btn:translate-x-1 transition-transform">{locale === 'ar' ? '←' : '→'}</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function BarChartIcon({ i }: { i: number }) {
    if (i === 0) return <TrendingUp className="w-7 h-7" />;
    if (i === 1) return <Ship className="w-7 h-7" />;
    if (i === 2) return <Building2 className="w-7 h-7" />;
    return <BarChart3 className="w-7 h-7" />;
}
