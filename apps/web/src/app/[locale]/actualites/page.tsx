import type { Locale } from '@/shared_lib';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ContentList } from '@/components/ContentList';
import { getPublishedContents } from '@/shared_lib';

export const revalidate = 60;

export default async function ActualitesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = await getDictionary(locale);

    // Fetch directly from DB instead of API route to avoid SSR edge casing
    const initialData = await getPublishedContents({ pageSize: 12, category: 'actualite' });

    return (
        <>
            <PageHero
                title={dict.content.categories.actualite}
                subtitle={dict.news.subtitle}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.content.categories.actualite },
                ]}
            />
            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ContentList
                        locale={locale}
                        dict={dict}
                        initialCategory="actualite"
                        initialItems={initialData.items}
                    />
                </div>
            </section>
        </>
    );
}

