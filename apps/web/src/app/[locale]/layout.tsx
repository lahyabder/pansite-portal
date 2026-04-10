import type { Locale, SiteSettings, Menu } from '@pan/shared';
import { getDir, t } from '@pan/shared';
import { Inter, Tajawal } from 'next/font/google';
import { getDictionary } from '@/lib/dictionaries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';
import { CookieBanner } from '@/components/CookieBanner';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSiteSettings, getMenuByLocation } from '@pan/shared';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
});

const tajawal = Tajawal({
    variable: '--font-tajawal',
    subsets: ['arabic', 'latin'],
    weight: ['200', '300', '400', '500', '700', '800', '900'],
    display: 'swap',
});

export function generateStaticParams() {
    return [{ locale: 'fr' }, { locale: 'ar' }, { locale: 'en' }, { locale: 'es' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const settings = await getSiteSettings();

    const title = t(settings?.siteName, locale) || 'Port Autonome de Nouadhibou';
    const description = settings?.seoGlobal?.defaultDescription || t(settings?.slogan, locale);

    return {
        title: {
            template: settings?.seoGlobal?.titleTemplate || `%s | ${title}`,
            default: title,
        },
        description,
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
        alternates: {
            languages: {
                fr: '/fr', ar: '/ar', en: '/en', es: '/es',
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
    const dict = await getDictionary(locale);
    
    // Fetch Dynamic Data
    const settings = await getSiteSettings();
    const mainMenu = await getMenuByLocation('main');
    const footerMenu = await getMenuByLocation('footer');

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: t(settings?.siteName, locale),
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr'}/icon.png`,
    };

    return (
        <html lang={locale} dir={dir}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${inter.variable} ${tajawal.variable} font-sans antialiased bg-pan-white text-pan-gray-900`}
                style={locale === 'ar' ? { fontFamily: 'var(--font-tajawal), sans-serif' } : undefined}
            >
                <Header locale={locale} dict={dict} menu={mainMenu || null} settings={settings || null} />
                <main className="min-h-screen">{children}</main>
                <Footer locale={locale} dict={dict} menu={footerMenu || null} settings={settings || null} />
                <CookieBanner />
                <Suspense fallback={null}>
                    <Analytics />
                </Suspense>
            </body>
        </html>
    );
}
