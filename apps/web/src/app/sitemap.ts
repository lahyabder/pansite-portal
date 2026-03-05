import { MetadataRoute } from 'next';

const STATIC_ROUTES = [
    '',
    '/le-port',
    '/infrastructures',
    '/services',
    '/procedures',
    '/tarifs',
    '/escales',
    '/appels-offres',
    '/documentation',
    '/medias',
    '/contact',
    '/mentions-legales',
    '/politique-confidentialite'
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr';

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const locale of ['fr', 'ar']) {
        for (const route of STATIC_ROUTES) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        }
    }

    return sitemapEntries;
}
