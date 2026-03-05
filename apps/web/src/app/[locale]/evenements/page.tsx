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
    const locale = (localeParam === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.content.categories.evenement}
                subtitle={locale === 'ar' ? 'الفعاليات والمناسبات القادمة.' : 'Prochains événements et manifestations du PAN.'}
                breadcrumbs={[
                    { label: locale === 'ar' ? 'الرئيسية' : 'Accueil', href: `/${locale}` },
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
