import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ContentList } from '@/components/ContentList';

export default async function EvenementsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    const subtitles = {
        ar: 'الفعاليات والمناسبات القادمة.',
        fr: 'Prochains événements et manifestations du PAN.',
        en: 'Upcoming events and manifestations of PAN.',
        es: 'Próximos eventos y manifestaciones del PAN.'
    }[locale];

    return (
        <>
            <PageHero
                title={dict.content.categories.evenement}
                subtitle={subtitles}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.content.categories.evenement },
                ]}
            />
            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ContentList locale={locale} dict={dict} initialCategory="evenement" />
                </div>
            </section>
        </>
    );
}
