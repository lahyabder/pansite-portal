import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function InfrastructuresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: { length: 'الطول', draft: 'عمق الغاطس' },
        fr: { length: 'Longueur', draft: 'Tirant d\'eau' },
        en: { length: 'Length', draft: 'Draft' },
        es: { length: 'Longitud', draft: 'Calado' },
    }[locale];

    return (
        <>
            <PageHero
                title={dict.pages.infrastructure.title}
                subtitle={dict.pages.infrastructure.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.port.title, href: `/${locale}/le-port` },
                    { label: dict.pages.infrastructure.title },
                ]}
            />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-bold uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-pan-sky" />
                            {dict.pages.infrastructure.quais.title}
                        </div>
                        <h2 className="text-3xl font-bold text-pan-navy">{dict.pages.infrastructure.quais.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dict.pages.infrastructure.quais.items.map((quai, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-pan-pale border border-pan-navy/5 hover:border-pan-sky/20 transition-all hover:shadow-xl hover:shadow-pan-navy/5">
                                <h3 className="text-xl font-bold text-pan-navy mb-4 group-hover:text-pan-sky transition-colors">{quai.name}</h3>
                                <p className="text-pan-gray-600 text-sm leading-relaxed mb-6">{quai.info}</p>
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-pan-navy/5">
                                    <div>
                                        <div className="text-[10px] text-pan-gray-400 font-bold uppercase tracking-wider">{labels.length}</div>
                                        <div className="text-lg font-bold text-pan-navy">{quai.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-pan-gray-400 font-bold uppercase tracking-wider">{labels.draft}</div>
                                        <div className="text-lg font-bold text-pan-sky">{quai.draft}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-pan-navy text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pan-sky/10 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pan-gold/5 rounded-full -ml-48 -mb-48 blur-3xl" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-16 text-center lg:text-start">
                        <h2 className="text-3xl font-bold mb-4">{dict.pages.infrastructure.zones.title}</h2>
                        <div className="h-1 w-20 bg-pan-gold rounded-full mx-auto lg:mx-0" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {dict.pages.infrastructure.zones.items.map((zone, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                                <div className="text-pan-gold font-bold text-sm mb-2">{zone.area}</div>
                                <h3 className="text-xl font-bold mb-4">{zone.name}</h3>
                                <p className="text-pan-light/60 text-sm leading-relaxed">{zone.purpose}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
