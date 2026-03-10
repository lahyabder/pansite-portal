import type { Locale } from '@pan/shared';
import { getDir } from '@pan/shared';
import { Inter } from 'next/font/google';
import { getDictionary } from '@/lib/dictionaries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';
import { Suspense } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});



export function generateStaticParams() {
    return [{ locale: 'fr' }, { locale: 'ar' }, { locale: 'en' }, { locale: 'es' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dict = getDictionary(locale);

    const titles: Record<Locale, string> = {
        ar: 'ميناء نواذيبو المستقل',
        fr: 'Port Autonome de Nouadhibou (PAN)',
        en: 'Nouadhibou Autonomous Port (PAN)',
        es: 'Puerto Autónomo de Nouadhibou (PAN)',
    };
    const title = titles[locale];

    const descriptions: Record<Locale, string> = {
        ar: 'البوابة الرسمية للميناء المستقل بنواذيبو، المركز الملاحي والتجاري في موريتانيا وغبر إفريقيا.',
        fr: "Ouverture sur le monde, pôle économique et hub logistique majeur en Mauritanie et en Afrique de l'Ouest.",
        en: 'Official gateway of the Nouadhibou Autonomous Port, maritime and commercial hub in Mauritania and West Africa.',
        es: 'Puerta oficial del Puerto Autónomo de Nouadhibou, centro marítimo y comercial en Mauritania y África Occidental.',
    };
    const description = descriptions[locale];

    return {
        title: {
            template: `%s | ${title}`,
            default: title,
        },
        description,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
        alternates: {
            languages: {
                fr: '/fr',
                ar: '/ar',
                en: '/en',
                es: '/es',
            },
        },
        openGraph: {
            type: 'website',
            locale,
            url: `/${locale}`,
            title,
            description,
            siteName: title,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const dir = getDir(locale);
    const dict = getDictionary(locale);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Port Autonome de Nouadhibou',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr'}/icon.png`,
    };

    return (
        <html lang={locale} dir={dir}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${inter.variable} font-sans antialiased bg-pan-white text-pan-gray-900`}
            >
                <Header locale={locale} dict={dict} />
                <main className="min-h-screen">{children}</main>
                <Footer locale={locale} dict={dict} />
                <CookieBanner />
                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>
            </body>
        </html>
    );
}
