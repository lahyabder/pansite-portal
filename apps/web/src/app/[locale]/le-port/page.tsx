import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ComingSoon } from '@/components/ComingSoon';

export default async function LePortPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.port.title}
                subtitle={dict.pages.port.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.port.title },
                ]}
            />
            <ComingSoon message={dict.common.comingSoon} description={dict.common.comingSoonDesc} />
        </>
    );
}
