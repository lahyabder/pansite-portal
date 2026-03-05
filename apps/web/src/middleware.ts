import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

function getLocale(request: NextRequest): string {
    // Check cookie
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

    // Check Accept-Language header
    const acceptLang = request.headers.get('Accept-Language');
    if (acceptLang) {
        const preferred = acceptLang.split(',').map((l) => l.split(';')[0].trim().substring(0, 2));
        for (const lang of preferred) {
            if (locales.includes(lang)) return lang;
        }
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip for assets, api, _next
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/documents') ||
        pathname.includes('.')
    ) {
        return;
    }

    // Check if pathname already has a locale
    const hasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (hasLocale) return;

    // Redirect to default locale
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/((?!_next|api|favicon.ico|images|documents|.*\\..*).*)'],
};
