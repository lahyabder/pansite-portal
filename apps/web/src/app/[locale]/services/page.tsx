import type { Locale } from '@pan/shared';
import { t, mockServices } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.services.title}
                subtitle={dict.pages.services.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.services.title },
                ]}
            />

            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {mockServices.filter(s => s.isActive).map((service) => (
                            <div
                                key={service.id}
                                className="group bg-white rounded-2xl p-8 border border-pan-gray-100 hover:border-pan-sky/30 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 bg-pan-pale rounded-xl flex items-center justify-center shrink-0 group-hover:bg-pan-sky transition-colors duration-300">
                                        <span className="text-pan-sky group-hover:text-white text-2xl font-bold transition-colors">
                                            {service.icon.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-pan-navy mb-3">
                                            {t(service.name, locale)}
                                        </h3>
                                        <p className="text-pan-gray-500 leading-relaxed mb-4">
                                            {t(service.description, locale)}
                                        </p>
                                        <ul className="space-y-2 mb-5">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-pan-gray-600">
                                                    <svg className="w-4 h-4 text-pan-sky shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    {t(feature, locale)}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={`/${locale}/services/${service.slug}`}
                                            className="text-pan-sky font-medium text-sm hover:text-pan-blue transition-colors inline-flex items-center gap-1"
                                        >
                                            {dict.common.learnMore}
                                            <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
