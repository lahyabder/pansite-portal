import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function ProceduresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: {
            title: 'هل لديك أسئلة حول إجراءاتنا؟',
            subtitle: 'فريقنا التجاري تحت تصرفكم لمرافقتكم في خطواتكم.'
        },
        fr: {
            title: 'Des questions sur nos procédures ?',
            subtitle: 'Notre équipe commerciale est à votre disposition pour vous accompagner dans vos démarches.'
        },
        en: {
            title: 'Questions about our procedures?',
            subtitle: 'Our sales team is at your disposal to assist you in your steps.'
        },
        es: {
            title: '¿Preguntas sobre nuestros procedimientos?',
            subtitle: 'Nuestro equipo comercial está a su disposición para acompañarle en sus gestiones.'
        }
    }[locale];

    return (
        <>
            <PageHero
                title={dict.pages.procedures.title}
                subtitle={dict.pages.procedures.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.nav.services, href: `/${locale}/services` },
                    { label: dict.pages.procedures.title },
                ]}
            />

            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-12">
                        {dict.pages.procedures.steps.map((step, i) => (
                            <div key={i} className="flex gap-8 items-start group">
                                <div className="shrink-0 flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-pan-navy text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-pan-navy/20 group-hover:scale-110 transition-transform">
                                        {i + 1}
                                    </div>
                                    {i < dict.pages.procedures.steps.length - 1 && (
                                        <div className="w-0.5 h-20 bg-pan-navy/10 my-4" />
                                    )}
                                </div>
                                <div className="p-8 rounded-3xl bg-pan-pale/50 border border-pan-navy/5 flex-grow group-hover:bg-white group-hover:shadow-xl group-hover:shadow-pan-navy/5 transition-all">
                                    <h3 className="text-xl font-bold text-pan-navy mb-3 group-hover:text-pan-sky transition-colors">{step.title}</h3>
                                    <p className="text-pan-gray-600 leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-pan-navy">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">{labels.title}</h2>
                    <p className="text-pan-light/60 mb-10 text-lg">{labels.subtitle}</p>
                    <a href={`/${locale}/contact`} className="inline-flex items-center justify-center px-10 py-4 bg-pan-gold text-pan-navy font-bold rounded-2xl hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-pan-gold/20">
                        {dict.nav.contact}
                    </a>
                </div>
            </section>
        </>
    );
}
