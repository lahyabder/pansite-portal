import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function LePortPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.port.title}
                subtitle={dict.pages.port.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.port.title },
                ]}
            />

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Role & Strategic Vision */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-pan-sky" />
                                {dict.pages.port.role.title}
                            </div>
                            <h2 className="text-3xl font-bold text-pan-navy leading-tight whitespace-pre-line text-balance">
                                {dict.pages.port.role.description}
                            </h2>
                            <ul className="space-y-4">
                                {dict.pages.port.role.points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-pan-pale/50 border border-pan-navy/5">
                                        <div className="w-6 h-6 rounded-full bg-pan-navy text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <p className="text-pan-gray-600 leading-relaxed font-medium">{point}</p>
                                    </li>
                                ))}
                            </ul>
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
                                    {dict.pages.port.geography.title}
                                </h3>
                                <p className="text-pan-light/80 leading-relaxed text-lg">
                                    {dict.pages.port.geography.description}
                                </p>
                            </div>
                            <div className="p-8 rounded-2xl border border-pan-navy/10 bg-pan-pale shadow-sm">
                                <h3 className="text-xl font-bold text-pan-navy mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-pan-sky" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                    {dict.pages.port.evolution.title}
                                </h3>
                                <p className="text-pan-gray-600 leading-relaxed">
                                    {dict.pages.port.evolution.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Equipment Highlights */}
            <section className="py-20 bg-pan-pale/30 border-y border-pan-navy/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pan-navy">{dict.pages.port.equipment.title}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dict.pages.port.equipment.list.map((item, i) => (
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
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-pan-navy mb-4">{dict.pages.port.history.title}</h2>
                        <div className="h-1 w-20 bg-pan-gold mx-auto rounded-full" />
                    </div>

                    <div className="grid gap-12 lg:gap-8 lg:grid-cols-7 relative">
                        {dict.pages.port.history.milestones.map((milestone, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-white border-4 border-pan-gold shadow-md flex items-center justify-center text-pan-navy font-bold text-sm mb-4">
                                    {milestone.year}
                                </div>
                                <div className="p-4 rounded-xl bg-pan-pale/40 border border-pan-navy/5 shadow-sm hover:shadow-md transition-shadow duration-300 w-full min-h-[100px] flex items-center justify-center">
                                    <p className="text-xs text-pan-gray-700 font-bold leading-relaxed">
                                        {milestone.event}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact & Services */}
            <section className="py-24 bg-pan-navy text-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-pan-gold">{dict.pages.port.impact.title}</h2>
                            <p className="text-xl text-pan-light/80 leading-relaxed font-light">
                                {dict.pages.port.impact.description}
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
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold">{dict.pages.port.services.title}</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {dict.pages.port.services.list.map((service, i) => (
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
        </>
    );
}
