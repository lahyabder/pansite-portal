import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { Package, RefreshCw, Box, Truck, Anchor, Layout, Info } from 'lucide-react';
import Link from 'next/link';
import { getPublishedContents, getPageBySlug, resolveLocalized, t } from '@pan/shared';

export const revalidate = 60;

const ICON_MAP: Record<string, any> = {
    crane: Package,
    'refresh-cw': RefreshCw,
    box: Box,
    truck: Truck,
    anchor: Anchor,
    layout: Layout,
    manutention: Package,
    transbordements: RefreshCw,
    entreposage: Box,
    'transit-logistique': Truck,
    'services-navires': Anchor,
    'gestion-terminaux': Layout,
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    // Fetch dynamic services from database
    const { items: dbServices } = await getPublishedContents({ category: 'services', pageSize: 20 });
    
    const dbPage = await getPageBySlug('services');
    const pageData = dbPage?.content ? resolveLocalized(dbPage.content, locale) : dict.pages.services;
    const resolvedTitle = dbPage?.title ? resolveLocalized(dbPage.title, locale) : dict.pages.services.title;
    
    // Fallback to dictionary mock services if DB is empty to maintain content during first deploy
    const services = dbServices.length > 0 
        ? dbServices.map(item => ({
            slug: item.slug,
            title: t(item.title, locale),
            desc: t(item.excerpt, locale),
            icon: item.tags?.[0] || item.slug,
            points: item.tags?.slice(1) || [],
            isDynamic: true
        }))
        : pageData.list.map((s: any) => ({ ...s, isDynamic: false }));

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

            <section className="py-20 bg-white border-b border-pan-gray-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-pan-navy mb-6">
                        {dict.services.title}
                    </h2>
                    <p className="text-lg text-pan-gray-500 leading-relaxed">
                        {dict.services.subtitle}
                    </p>
                </div>
            </section>

            <section className="py-20 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = ICON_MAP[service.icon] || Anchor;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-8 border border-pan-gray-100 hover:border-pan-sky/30 hover:shadow-xl transition-all duration-500"
                                >
                                    <div className="flex flex-col gap-6">
                                        <div className="w-16 h-16 bg-pan-pale rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-pan-sky transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                                            <Icon className="w-8 h-8 text-pan-sky group-hover:text-white transition-colors duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-pan-navy mb-4 group-hover:text-pan-sky transition-colors duration-300">
                                                {service.title}
                                            </h3>
                                            <p className="text-pan-gray-500 leading-relaxed mb-6 text-sm line-clamp-3">
                                                {service.desc}
                                            </p>
                                            
                                            {service.points && service.points.length > 0 && (
                                                <ul className="space-y-3 mb-8">
                                                    {service.points.slice(0, 4).map((point, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-pan-gray-600">
                                                            <div className="mt-1 bg-pan-sky/10 rounded-full p-0.5">
                                                                <svg className="w-3.5 h-3.5 text-pan-sky" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                </svg>
                                                            </div>
                                                            <span className="flex-1 truncate">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            
                                            <Link
                                                href={`/${locale}/services/${service.slug}`}
                                                className="w-full justify-center text-pan-sky font-bold text-sm bg-pan-pale group-hover:bg-pan-sky group-hover:text-white py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center gap-2 group/btn"
                                            >
                                                {dict.common.learnMore}
                                                <span className="transition-transform duration-300 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1">
                                                    {locale === 'ar' ? '←' : '→'}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

