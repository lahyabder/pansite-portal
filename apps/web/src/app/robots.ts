import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pan.mr';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
