import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function TarifsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const footerLabels = {
        ar: {
            quote: 'يتم مراجعة التعريفات سنوياً لضمان التنافسية وجودة خدماتنا.',
            download: 'تحميل قائمة التعريفات (PDF)',
            contact: 'الاتصال بقسم الفوترة'
        },
        fr: {
            quote: 'Les tarifs sont révisés annuellement pour garantir la compétitivité et la qualité de nos services.',
            download: 'Télécharger la Grille (PDF)',
            contact: 'Contacter la Facturation'
        },
        en: {
            quote: 'Tariffs are reviewed annually to ensure competitiveness and quality of our services.',
            download: 'Download Tariff Grid (PDF)',
            contact: 'Contact Billing Department'
        },
        es: {
            quote: 'Las tarifas se revisan anualmente para garantizar la competitividad y calidad de nuestros servicios.',
            download: 'Descargar Tabla de Tarifas (PDF)',
            contact: 'Contactar Facturación'
        }
    }[locale];

    return (
        <>
            <PageHero
                title={dict.pages.tariffs.title}
                subtitle={dict.pages.tariffs.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.nav.services, href: `/${locale}/services` },
                    { label: dict.pages.tariffs.title },
                ]}
            />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-10">
                        {dict.pages.tariffs.categories.map((category, i) => (
                            <div key={i} className="group p-10 rounded-3xl bg-pan-pale border border-pan-navy/5 hover:border-pan-sky/20 transition-all hover:bg-white hover:shadow-2xl hover:shadow-pan-navy/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pan-sky/5 rounded-bl-3xl -mr-8 -mt-8 group-hover:bg-pan-sky/10 transition-colors" />
                                <h3 className="text-2xl font-bold text-pan-navy mb-8 relative z-10">{category.title}</h3>
                                <ul className="space-y-4 relative z-10">
                                    {category.details.map((detail, j) => (
                                        <li key={j} className="flex items-center gap-3 text-pan-gray-600 font-medium group-hover:text-pan-navy transition-colors">
                                            <svg className="w-5 h-5 text-pan-sky shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-pan-navy text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-xl font-light text-pan-light/70 mb-8 italic">
                        &quot;{footerLabels.quote}&quot;
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all">{footerLabels.download}</button>
                        <button className="px-8 py-3 bg-pan-gold text-pan-navy font-bold rounded-xl hover:bg-white transition-all">{footerLabels.contact}</button>
                    </div>
                </div>
            </section>
        </>
    );
}
