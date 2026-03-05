import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { DocumentLibrary } from '@/components/DocumentLibrary';

export default async function DocumentationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.ged.title}
                subtitle={dict.ged.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.ged.title },
                ]}
            />

            <section className="py-12 bg-pan-gray-50 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-6">
                    <DocumentLibrary locale={locale} dict={dict} />
                </div>
            </section>
        </>
    );
}
