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
    return [{ locale: 'fr' }, { locale: 'ar' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = (localeParam === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    const title = locale === 'ar' ? 'ميناء نواذيبو المستقل' : 'Port Autonome de Nouadhibou (PAN)';
    const description = locale === 'ar'
        ? 'البوابة الرسمية للميناء المستقل بنواذيبو، المركز الملاحي والتجاري في موريتانيا وغرب إفريقيا.'
        : 'Ouverture sur le monde, pôle économique et hub logistique majeur en Mauritanie et en Afrique de l\'Ouest.';

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
    const locale = (localeParam === 'ar' ? 'ar' : 'fr') as Locale;
    const dir = getDir(locale);
    const dict = getDictionary(locale);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Port Autonome de Nouadhibou',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr'}/icon.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+222 45 74 51 34',
            contactType: 'customer service',
            email: 'contact@pan.mr',
        },
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
