import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow login page and Next.js internals
    if (
        pathname === '/admin/login' ||
        pathname.startsWith('/admin/login/') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check session
    const hasSession = request.cookies.has('pan-admin-session');
    if (!hasSession) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Role-based access: editors can only access /admin/contents
    const role = request.cookies.get('pan-admin-role')?.value ?? 'admin';
    if (role === 'editor') {
        const allowedForEditor = [
            '/admin',          // root dashboard redirect
            '/admin/',
            '/admin/contents', // news/contents section
        ];
        const isAllowed = allowedForEditor.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith('/admin/contents'));
        if (!isAllowed) {
            return NextResponse.redirect(new URL('/admin/contents', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/((?!_next/static|_next/image|favicon.ico).*)'],
};
