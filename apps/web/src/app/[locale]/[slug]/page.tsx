import type { Locale } from '@pan/shared';
import { getPageBySlug, t } from '@pan/shared';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/BlockRenderer';
import { PageHero } from '@/components/PageHero';
import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface DynamicPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
    const { locale: lp, slug } = await params;
    const locale = lp as Locale;
    const page = await getPageBySlug(slug);

    if (!page) return {};

    const title = t(page.title, locale);
    const description = t(page.description, locale)?.slice(0, 160);

    return {
        title: title,
        description: description,
        openGraph: {
            title,
            description,
            type: 'article',
        },
    };
}

export default async function DynamicCMSPage({ params }: DynamicPageProps) {
    const { locale: lp, slug } = await params;
    const locale = lp as Locale;
    const dict = await getDictionary(locale);
    
    const page = await getPageBySlug(slug);

    if (!page || page.status !== 'published') {
        notFound();
    }

    return (
        <>
            <PageHero
                title={t(page.title, locale)}
                subtitle={t(page.description, locale)}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: t(page.title, locale) },
                ]}
            />
            
            <main className="min-h-screen">
                <BlockRenderer blocks={page.blocks || []} locale={locale} />
            </main>
        </>
    );
}
