import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'ar', 'en', 'es'];
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
    const hostname = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    // Force HTTPS and www in production for pan.mr
    if (process.env.NODE_ENV === 'production' && (hostname === 'pan.mr' || (hostname === 'www.pan.mr' && protocol === 'http'))) {
        const url = request.nextUrl.clone();
        url.host = 'www.pan.mr';
        url.protocol = 'https:';
        url.port = '';
        return NextResponse.redirect(url, 301);
    }

    // Redirect localized admin paths (e.g., /fr/admin) to the base admin path (/admin)
    if (pathname.match(new RegExp(`^/(${locales.join('|')})/admin(/.*)?$`))) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');
        return NextResponse.redirect(url);
    }

    // Skip for assets, api, _next
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/admin') ||
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

    if (hasLocale) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-current-path', pathname);
        return NextResponse.next({
            request: { headers: requestHeaders }
        });
    }

    // Redirect to default locale
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/((?!_next|api|admin|favicon.ico|images|documents|.*\\..*).*)'],
};
