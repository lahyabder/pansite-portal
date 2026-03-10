import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ContentList } from '@/components/ContentList';

export default async function CommuniquesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    const subtitles = {
        ar: 'البيانات الرسمية والإعلانات من إدارة الميناء.',
        fr: 'Communiqués officiels et annonces de la direction du port.',
        en: 'Official communiqués and announcements from port management.',
        es: 'Comunicados oficiales y anuncios de la dirección del puerto.'
    }[locale];

    return (
        <>
            <PageHero
                title={dict.content.categories.communique}
                subtitle={subtitles}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.content.categories.communique },
                ]}
            />
            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ContentList locale={locale} dict={dict} initialCategory="communique" />
                </div>
            </section>
        </>
    );
}
