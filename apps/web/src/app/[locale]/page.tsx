import type { Locale } from '@pan/shared';
import { t, formatDate, getSiteSettings, getPageBySlug, getLatestContents } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import Image from 'next/image';
import { AlertBar } from '@/components/AlertBar';
import { HeroSlider } from '@/components/HeroSlider';
import { Ship, Anchor, Building2, FileText, Calendar, Phone, TrendingUp, ShipWheel, BarChart3, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = await getDictionary(locale);

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

    const IconMap: Record<string, any> = {
        Ship, Anchor, Building2, FileText, Calendar, Phone, TrendingUp, ShipWheel, BarChart3, Globe
    };

    const sortedBlocks = homePage?.blocks?.sort((a, b) => a.order - b.order) || [];

    return (
        <div className="relative">
            <AlertBar locale={locale} dict={dict} />

            {/* ═══ Message du Directeur Général (Permanent Highlight) ═══ */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-pan-navy rounded-[3rem] overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-pan-blue/10 -skew-x-12 translate-x-20" />
                        <div className="grid lg:grid-cols-2 items-center">
                            <div className="p-12 lg:p-20 space-y-8 relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-pan-gold text-[10px] font-black uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pan-gold animate-pulse" />
                                    Vision & Ambition
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                                    {dict.pages.port.dg_word.title}
                                </h2>
                                <p className="text-pan-light/70 text-lg leading-relaxed line-clamp-4 font-medium italic">
                                    "{dict.pages.port.dg_word.content.split('\n\n')[0]}..."
                                </p>
                                <Link 
                                    href={`/${locale}/le-port`} 
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-pan-gold text-pan-navy font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all duration-300 shadow-xl shadow-pan-gold/20"
                                >
                                    {dict.common.learnMore}
                                    <span aria-hidden="true" className="text-lg">{locale === 'ar' ? '←' : '→'}</span>
                                </Link>
                            </div>
                            <div className="relative h-[400px] lg:h-[600px] w-full">
                                <Image 
                                    src="/images/dg.png" 
                                    alt="Directeur Général" 
                                    fill 
                                    className="object-cover object-top brightness-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-pan-navy via-transparent to-transparent opacity-60 lg:hidden" />
                                <div className="absolute bottom-10 right-10 left-10 lg:left-auto lg:right-20 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-white shadow-2xl">
                                    <div className="text-2xl font-black mb-1">Ahmed Ould Sidahmed Ould Die</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-pan-gold">Directeur Général - PAN</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {sortedBlocks.map((block: any, bIdx: number) => {
                if (block.type === 'hero') {
                    return (
                        <HeroSlider 
                            key={`block-${bIdx}`}
                            dict={dict} 
                            locale={locale} 
                            settings={settings || null} 
                            slides={block.content?.slides}
                        />
                    );
                }

                if (block.type === 'stats') {
                    const displayStats = block.content?.items || [];
                    if (displayStats.length === 0) return null;
                    return (
                        <section key={`block-${bIdx}`} className="relative z-10 -mt-16 lg:-mt-20">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-2 lg:grid-cols-4 border border-pan-gray-100 divide-x divide-pan-gray-50 rtl:divide-x-reverse">
                                    {displayStats.map((stat: any, i: number) => (
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
                    );
                }

                    );
                }

                if (block.type === 'quick_services') {
                    const servicesList = block.content?.items || [];
                    if (servicesList.length === 0) return null;
                    return (
                        <section key={`block-${bIdx}`} className="py-32 bg-pan-pale/50">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="flex flex-col items-center text-center mb-20">
                                    <span className="text-pan-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                                        {t(block.content?.subtitle, locale) || 'Portail Services'}
                                    </span>
                                    <h2 className="text-4xl lg:text-5xl font-black text-pan-navy mb-6">
                                        {t(block.content?.title, locale) || dict.quickAccess}
                                    </h2>
                                    <div className="w-20 h-1 bg-pan-navy rounded-full" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                    {servicesList.map((qs: any, i: number) => {
                                        const IconComp = IconMap[qs.icon] || Ship;
                                        return (
                                            <Link
                                                href={qs.href?.startsWith('http') ? qs.href : `/${locale}${qs.href?.startsWith('/') ? '' : '/'}${qs.href}`}
                                                key={i}
                                                className="group bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl border border-pan-gray-100 hover:border-pan-navy transition-all duration-500 flex flex-col items-center justify-center text-center hover:-translate-y-2"
                                            >
                                                <div className="w-20 h-20 rounded-2xl bg-pan-pale flex items-center justify-center text-pan-navy mb-8 group-hover:bg-pan-navy group-hover:text-white transition-all duration-500">
                                                    <IconComp className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-sm font-black uppercase tracking-wider text-pan-navy group-hover:text-pan-gold transition-colors">
                                                    {t(qs.title, locale)}
                                                </h3>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                    );
                }

                if (block.type === 'latest_news') {
                    return (
                        <section key={`block-${bIdx}`} className="py-32 bg-white relative overflow-hidden">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="flex items-end justify-between mb-20">
                                    <div className="max-w-2xl">
                                        <span className="text-pan-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
                                            {t(block.content?.subtitle, locale) || 'Actualités & Presse'}
                                        </span>
                                        <h2 className="text-4xl lg:text-6xl font-black text-pan-navy mb-8">
                                            {t(block.content?.title, locale) || dict.news.title}
                                        </h2>
                                        <p className="text-lg text-pan-gray-400 font-medium">
                                            {t(block.content?.description, locale) || dict.news.subtitle}
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
                    );
                }

                if (block.type === 'rich_text') {
                    if (!block.content?.text?.[locale]) return null;
                    return (
                        <section key={`block-${bIdx}`} className="py-20 bg-white">
                            <div className="max-w-4xl mx-auto px-6 prose prose-lg" dangerouslySetInnerHTML={{ __html: block.content.text[locale] }} />
                        </section>
                    );
                }

                return null;
            })}
        </div>
    );
}

function BarChartIcon({ i }: { i: number }) {
    if (i === 0) return <TrendingUp className="w-7 h-7" />;
    if (i === 1) return <Ship className="w-7 h-7" />;
    if (i === 2) return <Building2 className="w-7 h-7" />;
    return <BarChart3 className="w-7 h-7" />;
}
