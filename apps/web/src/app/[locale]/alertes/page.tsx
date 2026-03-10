import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ContentList } from '@/components/ContentList';

export default async function AlertesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    const subtitles = {
        ar: 'التنبيهات والإشعارات الهامة.',
        fr: 'Avis importants et alertes portuaires.',
        en: 'Important notices and port alerts.',
        es: 'Avisos importantes y alertas portuarias.'
    }[locale];

    return (
        <>
            <PageHero
                title={dict.content.categories.alerte}
                subtitle={subtitles}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.content.categories.alerte },
                ]}
            />
            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ContentList locale={locale} dict={dict} initialCategory="alerte" />
                </div>
            </section>
        </>
    );
}
