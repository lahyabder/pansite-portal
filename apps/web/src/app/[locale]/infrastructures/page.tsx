import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { InfrastructureMap } from '@/components/InfrastructureMap';

export default async function InfrastructuresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: { length: 'الطول', draft: 'عمق الغاطس', status: 'الحالة', operational: 'تشغيلي' },
        fr: { length: 'Longueur', draft: 'Tirant d\'eau', status: 'Statut', operational: 'Opérationnel' },
        en: { length: 'Length', draft: 'Draft', status: 'Status', operational: 'Operational' },
        es: { length: 'Longitud', draft: 'Calado', status: 'Estado', operational: 'Operativo' },
    }[locale];

    return (
        <div className="bg-pan-pale min-h-screen">
            <PageHero
                title={dict.pages.infrastructure.title}
                subtitle={dict.pages.infrastructure.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.infrastructure.title },
                ]}
            />

            {/* Interactive Map Section */}
            <section className="py-12 -mt-20 relative z-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-4 lg:p-8 shadow-2xl shadow-pan-navy/10 border border-white/40">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pan-navy/5 text-pan-navy text-[10px] font-bold uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pan-sky animate-pulse" />
                                    {dict.pages.infrastructure.quais.title}
                                </div>
                                <h2 className="text-3xl font-bold text-pan-navy tracking-tight">Vue Interactive du Port</h2>
                                <p className="text-pan-gray-500 mt-2 text-sm max-w-xl">Explorez nos installations portuaires en temps réel via notre carte interactive. Survolez les zones pour plus de détails.</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-pan-gray-400">
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pan-sky" /> {labels.operational}</span>
                            </div>
                        </div>
                        
                        <InfrastructureMap />
                    </div>
                </div>
            </section>

            {/* Detailed Cards Section */}
            <section className="py-24 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {dict.pages.infrastructure.quais.items.map((quai, i) => (
                            <div 
                                key={i} 
                                className="group relative bg-white rounded-3xl p-1 shadow-xl shadow-pan-navy/5 hover:shadow-2xl hover:shadow-pan-navy/10 transition-all duration-500 hover:-translate-y-2 border border-pan-navy/5"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pan-navy/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative p-8 pt-10">
                                    {/* Icon/Number */}
                                    <div className="absolute top-0 right-8 -translate-y-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-pan-navy to-pan-blue flex items-center justify-center text-white font-bold shadow-lg shadow-pan-navy/20">
                                        0{i + 1}
                                    </div>

                                    <h3 className="text-2xl font-bold text-pan-navy mb-4 group-hover:text-pan-sky transition-colors">{quai.name}</h3>
                                    <p className="text-pan-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-pan-gray-700 transition-colors">{quai.info}</p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-pan-pale group-hover:bg-white transition-colors border border-transparent group-hover:border-pan-navy/5">
                                            <span className="text-xs font-bold text-pan-gray-400 uppercase tracking-widest">{labels.length}</span>
                                            <span className="text-lg font-black text-pan-navy">{quai.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-pan-pale group-hover:bg-white transition-colors border border-transparent group-hover:border-pan-navy/5">
                                            <span className="text-xs font-bold text-pan-gray-400 uppercase tracking-widest">{labels.draft}</span>
                                            <span className="text-lg font-black text-pan-sky">{quai.draft}</span>
                                        </div>
                                    </div>

                                    <button className="mt-8 w-full py-4 rounded-2xl bg-pan-navy text-white text-sm font-bold uppercase tracking-widest hover:bg-pan-sky transition-all shadow-lg shadow-pan-navy/10 flex items-center justify-center gap-2 group/btn">
                                        Détails Techniques
                                        <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Zones Section with Modern Aesthetic */}
            <section className="py-24 bg-pan-navy relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pan-sky/20 rounded-full blur-[120px] -mr-64 -mt-64 text-white" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20">
                        <div className="max-w-xl">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">{dict.pages.infrastructure.zones.title}</h2>
                            <p className="text-pan-light/60 text-lg">Des espaces spécialisés conçus pour optimiser chaque maillon de la chaîne logistique et industrielle du port.</p>
                        </div>
                        <div className="h-0.5 w-32 bg-pan-gold hidden lg:block" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {dict.pages.infrastructure.zones.items.map((zone, i) => (
                            <div key={i} className="group p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-500">
                                <div className="text-pan-gold font-black text-2xl mb-4 group-hover:scale-110 transition-transform origin-left">{zone.area}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{zone.name}</h3>
                                <p className="text-pan-light/50 leading-relaxed group-hover:text-pan-light/80 transition-colors uppercase text-xs font-bold tracking-widest">{zone.purpose}</p>
                                
                                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pan-gold" />
                                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Zone Stratégique</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
