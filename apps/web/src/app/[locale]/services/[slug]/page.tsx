import type { Locale } from '@pan/shared';
import { t, mockServices } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RequestFormClient } from '@/components/RequestForm';

export async function generateStaticParams() {
    return mockServices.flatMap((s) => [
        { locale: 'fr', slug: s.slug },
        { locale: 'ar', slug: s.slug },
    ]);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale: lp, slug } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const service = mockServices.find((s) => s.slug === slug);
    if (!service) return {};

    const title = t(service.name, locale);
    const description = t(service.description, locale);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale: lp, slug } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    const service = mockServices.find((s) => s.slug === slug);
    if (!service) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: t(service.name, locale),
        description: t(service.description, locale),
        provider: {
            '@type': 'Organization',
            name: 'Port Autonome de Nouadhibou',
        },
        areaServed: {
            '@type': 'Place',
            name: 'Nouadhibou, Mauritanie',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PageHero
                title={t(service.name, locale)}
                subtitle={t(service.description, locale)}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.services.title, href: `/${locale}/services` },
                    { label: t(service.name, locale) },
                ]}
            />

            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Long description */}
                            {service.longDescription && (
                                <div className="bg-white rounded-2xl p-8 border border-pan-gray-100">
                                    <h2 className="text-xl font-bold text-pan-navy mb-4">{dict.services.description}</h2>
                                    <p className="text-pan-gray-500 leading-relaxed">{t(service.longDescription, locale)}</p>
                                </div>
                            )}

                            {/* Features */}
                            <div className="bg-white rounded-2xl p-8 border border-pan-gray-100">
                                <h2 className="text-xl font-bold text-pan-navy mb-4">{dict.services.features}</h2>
                                <ul className="space-y-3">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-3 text-pan-gray-600">
                                            <svg className="w-5 h-5 text-pan-sky shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            {t(f, locale)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Steps procedure */}
                            {service.steps && service.steps.length > 0 && (
                                <div className="bg-white rounded-2xl p-8 border border-pan-gray-100">
                                    <h2 className="text-xl font-bold text-pan-navy mb-6">{dict.services.procedure}</h2>
                                    <div className="space-y-4">
                                        {service.steps.map((step, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-10 h-10 bg-pan-sky text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-pan-navy">{t(step.title, locale)}</h3>
                                                    <p className="text-pan-gray-500 text-sm mt-0.5">{t(step.description, locale)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Required documents */}
                            {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                                <div className="bg-white rounded-2xl p-8 border border-pan-gray-100">
                                    <h2 className="text-xl font-bold text-pan-navy mb-4">{dict.services.requiredDocuments}</h2>
                                    <ul className="space-y-2">
                                        {service.requiredDocuments.map((doc, i) => (
                                            <li key={i} className="flex items-center gap-2 text-pan-gray-600 text-sm">
                                                <span className="text-pan-sky">📄</span>
                                                {t(doc, locale)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Request form */}
                            <div className="bg-white rounded-2xl p-8 border border-pan-sky/20 shadow-sm">
                                <h2 className="text-xl font-bold text-pan-navy mb-6">{dict.services.submitRequest}</h2>
                                <RequestFormClient locale={locale} dict={dict} serviceId={service.id} serviceName={t(service.name, locale)} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Beneficiaries */}
                            {service.beneficiaries && service.beneficiaries.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-pan-gray-100">
                                    <h3 className="font-bold text-pan-navy mb-3 text-sm uppercase tracking-wider">{dict.services.beneficiaries}</h3>
                                    <ul className="space-y-2">
                                        {service.beneficiaries.map((b, i) => (
                                            <li key={i} className="text-pan-gray-600 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-pan-sky rounded-full shrink-0" />
                                                {t(b, locale)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Prerequisites */}
                            {service.prerequisites && service.prerequisites.length > 0 && (
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <h3 className="font-bold text-amber-800 mb-3 text-sm uppercase tracking-wider">{dict.services.prerequisites}</h3>
                                    <ul className="space-y-2">
                                        {service.prerequisites.map((p, i) => (
                                            <li key={i} className="text-amber-700 text-sm flex items-center gap-2">
                                                <span>⚠️</span>
                                                {t(p, locale)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Deadline + cost */}
                            <div className="bg-pan-pale rounded-2xl p-6 border border-pan-sky/10 space-y-4">
                                {service.deadline && (
                                    <div>
                                        <h3 className="font-bold text-pan-navy text-sm uppercase tracking-wider mb-1">{dict.services.deadline}</h3>
                                        <p className="text-pan-gray-600 text-sm">{t(service.deadline, locale)}</p>
                                    </div>
                                )}
                                {service.costs && (
                                    <div>
                                        <h3 className="font-bold text-pan-navy text-sm uppercase tracking-wider mb-1">{dict.services.costs}</h3>
                                        <p className="text-pan-gray-600 text-sm">{t(service.costs, locale)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact */}
                            {service.contactPoints && service.contactPoints.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-pan-gray-100">
                                    <h3 className="font-bold text-pan-navy mb-3 text-sm uppercase tracking-wider">{dict.services.contact}</h3>
                                    {service.contactPoints.map((cp, i) => (
                                        <div key={i} className="space-y-1 text-sm">
                                            <div className="font-semibold text-pan-navy">{t(cp.name, locale)}</div>
                                            {cp.phone && <div className="text-pan-gray-500">📞 {cp.phone}</div>}
                                            {cp.email && <div className="text-pan-sky">✉️ {cp.email}</div>}
                                            {cp.hours && <div className="text-pan-gray-500">🕐 {t(cp.hours, locale)}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Back to services */}
                            <Link
                                href={`/${locale}/services`}
                                className="block text-center text-pan-sky text-sm hover:text-pan-blue transition-colors py-3 bg-white rounded-2xl border border-pan-gray-100"
                            >
                                ← {dict.services.backToList}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
