import type { Locale } from '@/shared_lib';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { getPublishedContents, getPageBySlug, resolveLocalized } from '@/shared_lib';
import { ContentCard } from '@/components/ContentCard';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LePortPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    const initialData = await getPublishedContents({ pageSize: 12, category: 'le-port' });
    const items = initialData.items;

    const dbPage = await getPageBySlug('le-port');
    const pageDataObj = dbPage?.blocks?.[0]?.type === 'custom_page_data' ? dbPage.blocks[0].content : null;
    const pageData = pageDataObj ? resolveLocalized(pageDataObj, locale) : dict.pages.port;
    const resolvedTitle = dbPage?.title ? resolveLocalized(dbPage.title, locale) : dict.pages.port.title;

    return (
        <>
            <PageHero
                title={resolvedTitle}
                subtitle={pageData.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: resolvedTitle },
                ]}
            />

            {/* ═══ Mot du Directeur Général (Premium Section) ═══ */}
            <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-pan-pale/30 -z-10 skew-x-12 translate-x-20" />
                
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                        {/* Image Column */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative aspect-[4/5] lg:aspect-[4/5] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-10 border-4 lg:border-8 border-white">
                                <Image 
                                    src="/images/dg.png" 
                                    alt={dict.pages.port.dg_word.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pan-gold/10 rounded-full blur-3xl -z-10" />
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-pan-navy/5 rounded-full blur-3xl -z-10" />
                            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 p-4 lg:p-6 bg-pan-navy text-white rounded-2xl shadow-xl z-20 border-l-4 border-pan-gold">
                                <div className="text-lg lg:text-xl font-bold">Ahmed Ould Sidahmed Ould Die</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-pan-gold mt-1">Directeur Général - PAN</div>
                            </div>
                        </div>

                        {/* Text Column */}
                        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-pan-navy/5 text-pan-navy text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 lg:mb-6">
                                    Institution Stratégique
                                </span>
                                <h2 className="text-3xl lg:text-5xl font-black text-pan-navy leading-tight mb-6 lg:mb-8">
                                    {dict.pages.port.dg_word.title}
                                </h2>
                                <div className="w-20 h-1.5 bg-pan-gold rounded-full mb-8 lg:mb-12" />
                            </div>

                            <div className="prose prose-base lg:prose-lg max-w-none">
                                {(dict.pages.port.dg_word.content || '').split('\n\n').map((paragraph: string, i: number) => (
                                    <p key={i} className="text-pan-gray-600 leading-relaxed font-medium mb-6 text-justify">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-pan-navy/5 flex items-center justify-between">
                                <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                    <div className="text-xl lg:text-2xl font-black text-pan-navy">Le Directeur Général</div>
                                    <div className="h-1 w-12 bg-pan-gold mt-2 rounded-full" />
                                </div>
                                <Image src="/logo-horizontal.png" alt="PAN" width={100} height={25} className="opacity-20 grayscale brightness-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Role & Strategic Vision */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-pan-sky" />
                                {pageData.role.title}
                            </div>
                            <h2 className="text-3xl font-bold text-pan-navy leading-tight whitespace-pre-line text-balance">
                                {pageData.role.description}
                            </h2>
                            <ul className="space-y-4">
                                {pageData.role.points.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-pan-pale/50 border border-pan-navy/5">
                                        <div className="w-6 h-6 rounded-full bg-pan-navy text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-pan-gray-600 leading-relaxed font-medium">{point}</p>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg mt-8">
                                <Image 
                                    src={(pageData as any).images?.role || "/images/hero/hero-1.jpg"}
                                    alt={pageData.role.title} 
                                    fill 
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Geography & Evolution */}
                        <div className="grid gap-6">
                            <div className="p-8 rounded-2xl bg-pan-navy text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-500 group-hover:scale-110" />
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pan-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    {pageData.geography.title}
                                </h3>
                                <p className="text-pan-light/80 leading-relaxed text-lg">
                                    {pageData.geography.description}
                                </p>
                            </div>
                            <div className="p-8 rounded-2xl border border-pan-navy/10 bg-pan-pale shadow-sm">
                                <h3 className="text-xl font-bold text-pan-navy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pan-sky" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                    {pageData.evolution.title}
                                </h3>
                                <p className="text-pan-gray-600 leading-relaxed">
                                    {pageData.evolution.description}
                                </p>
                            </div>
                            
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg mt-2">
                                <Image 
                                    src={(pageData as any).images?.geography || "/images/port/historical-boats.png"}
                                    alt={pageData.geography.title} 
                                    fill 
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Equipment Highlights */}
            <section className="py-20 bg-pan-pale/30 border-y border-pan-navy/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pan-navy">{pageData.equipment.title}</h2>
                    </div>
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                            {pageData.equipment.list.map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white shadow-sm border border-pan-navy/5">
                                    <div className="w-10 h-10 rounded-xl bg-pan-gold/10 flex items-center justify-center text-pan-gold shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-pan-gray-700 leading-snug">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-2 relative h-[400px] w-full rounded-3xl overflow-hidden shadow-xl">
                            <Image 
                                src="/images/port/equipments-real.jpg" 
                                alt={pageData.equipment.title} 
                                fill 
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Premium History Section (Museum Style) ═══ */}
            <section className="py-32 bg-pan-navy relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pan-gold/40 to-transparent" />
                <div className="absolute -top-64 -right-64 w-[600px] h-[600px] bg-pan-blue/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] bg-pan-gold/5 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-24">
                        <span className="inline-block px-4 py-1.5 bg-pan-gold/10 text-pan-gold text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-pan-gold/20 mb-6">
                            Est. 1955
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                            {pageData.history.title}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="h-px w-12 bg-pan-gold/30" />
                            <div className="w-2 h-2 rounded-full bg-pan-gold" />
                            <div className="h-px w-12 bg-pan-gold/30" />
                        </div>
                    </div>

                    {/* Timeline Grid */}
                    <div className="relative mb-32">
                        {/* Connecting Line */}
                        <div className="absolute top-[4.5rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-pan-gold/50 to-transparent hidden lg:block" />
                        
                        <div className="grid gap-12 lg:gap-6 lg:grid-cols-4 relative group/timeline">
                            {pageData.history.milestones.map((milestone: any, idx: number) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center group/item">
                                    {/* Vertical line for mobile */}
                                    {idx !== pageData.history.milestones.length - 1 && (
                                        <div className="absolute top-24 bottom-[-3rem] w-px bg-gradient-to-b from-pan-gold/50 to-transparent left-1/2 -translate-x-1/2 lg:hidden" />
                                    )}

                                    {/* Year Bubble */}
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 bg-pan-gold rounded-full scale-[1.3] opacity-0 group-hover/item:opacity-20 group-hover/item:scale-[1.8] blur-xl transition-all duration-700" />
                                        <div className="w-20 h-20 rounded-full bg-pan-navy border-[3px] border-pan-gold/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.1)] group-hover/item:border-pan-gold group-hover/item:shadow-[0_0_40px_rgba(234,179,8,0.25)] transition-all duration-700 relative z-20">
                                            <span className="text-pan-gold text-lg font-black tracking-tight">{milestone.year}</span>
                                            <div className="w-1 h-1 bg-pan-gold rounded-full mt-1 opacity-50" />
                                        </div>
                                    </div>
                                    
                                    {/* Card */}
                                    <div className="w-full p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-3 transition-all duration-700 group/card relative">
                                        {/* Decorative Corner */}
                                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover/card:opacity-60 transition-opacity">
                                            <div className="w-6 h-6 border-t font-extralight border-r border-pan-gold" />
                                        </div>
                                        
                                        <p className="text-sm md:text-base text-pan-light/70 font-medium leading-relaxed group-hover/card:text-pan-light transition-colors">
                                            {milestone.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Museum-style High Quality Archival Image */}
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -inset-4 bg-pan-gold/5 rounded-[2.5rem] blur-xl" />
                        <div className="relative rounded-[2rem] overflow-hidden border-[12px] border-white shadow-[0_30px_60px_rgba(0,0,0,0.5)] group/frame">
                            <div className="absolute inset-0 bg-black/40 z-10 opacity-30 group-hover/frame:opacity-0 transition-opacity duration-1000" />
                            <div className="relative h-64 md:h-[600px] w-full">
                                <Image 
                                    src="/images/hero/hero-5.jpg" 
                                    alt={pageData.history.title} 
                                    fill 
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover/frame:scale-105"
                                />
                            </div>
                            
                            {/* Museum Tag */}
                            <div className="absolute bottom-10 left-10 z-20 pointer-events-none translate-y-4 opacity-0 group-hover/frame:translate-y-0 group-hover/frame:opacity-100 transition-all duration-700">
                                <div className="bg-pan-navy/80 backdrop-blur-md p-8 border-l border-pan-gold max-w-md shadow-2xl">
                                    <span className="text-pan-gold text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
                                        {locale === 'ar' ? 'أرشيف تاريخي' : locale === 'en' ? 'Historical Archives' : 'Archives Historiques'}
                                    </span>
                                    <h4 className="text-white text-2xl font-bold mb-3">{pageData.title}</h4>
                                    <p className="text-pan-light/60 text-xs leading-relaxed uppercase tracking-widest italic">
                                        Photographie originale des premières installations portuaires
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Artistic Overlay Text */}
                        <div className="absolute -right-8 -bottom-16 opacity-10 select-none pointer-events-none hidden lg:block">
                            <span className="text-[12rem] font-black text-white leading-none tracking-tighter">
                                PAN
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact & Services */}
            <section className="py-24 bg-pan-navy text-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-pan-gold">{pageData.impact.title}</h2>
                            <p className="text-xl text-pan-light/80 leading-relaxed font-light">
                                {pageData.impact.description}
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-4xl font-bold text-pan-gold mb-1">90+</div>
                                    <div className="text-[10px] text-pan-light/40 font-bold uppercase tracking-widest">
                                        {{
                                            ar: 'شركاء خصوصيين',
                                            fr: 'Partenaires Privés',
                                            en: 'Private Partners',
                                            es: 'Socios Privados'
                                        }[locale]}
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-4xl font-bold text-pan-gold mb-1">24/7</div>
                                    <div className="text-[10px] text-pan-light/40 font-bold uppercase tracking-widest">
                                        {{
                                            ar: 'جاهزية',
                                            fr: 'Disponibilité',
                                            en: 'Availability',
                                            es: 'Disponibilidad'
                                        }[locale]}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg mt-8">
                                <Image 
                                    src="/images/hero/hero-4.jpg" 
                                    alt={pageData.impact.title} 
                                    fill 
                                    className="object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">{pageData.services.title}</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {pageData.services.list.map((service: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/15 transition-all border border-white/5 group border-l-4 border-l-pan-gold">
                                        <svg className="w-5 h-5 text-pan-gold/80 group-hover:text-pan-gold transition-colors shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium text-pan-light/90 leading-snug">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic CMS Content */}
            {items.length > 0 && (
                <section className="py-24 bg-pan-gray-50 border-t border-pan-navy/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-pan-navy mb-4">
                                {dict.content.categories['le-port']}
                            </h2>
                            <div className="h-1 w-20 bg-pan-gold rounded-full" />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <ContentCard key={item.id} item={item} locale={locale} dict={dict} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
// Manual rebuild: Thu Apr  9 15:41:09 GMT 2026
