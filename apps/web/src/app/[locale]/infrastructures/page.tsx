import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { ComingSoon } from '@/components/ComingSoon';

export default async function InfrastructuresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.infrastructure.title}
                subtitle={dict.pages.infrastructure.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.port.title, href: `/${locale}/le-port` },
                    { label: dict.pages.infrastructure.title },
                ]}
            />
            <ComingSoon message={dict.common.comingSoon} description={dict.common.comingSoonDesc} />
        </>
    );
}
