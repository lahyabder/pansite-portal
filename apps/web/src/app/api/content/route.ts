import { NextRequest, NextResponse } from 'next/server';
import { getAllContents, getPublishedContents, createContent } from '@pan/shared';
import type { ContentCategory, ContentStatus } from '@pan/shared';

// Allow cross-origin requests from admin panel
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const admin = searchParams.get('admin') === 'true';
    const category = searchParams.get('category') as ContentCategory | null;
    const status = searchParams.get('status') as ContentStatus | null;
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (admin) {
        // Admin view: all contents including drafts
        const all = getAllContents();
        let filtered = all;
        if (category) filtered = filtered.filter(c => c.category === category);
        if (status) filtered = filtered.filter(c => c.status === status);
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.fr.toLowerCase().includes(q) ||
                c.title.ar.includes(q) ||
                c.slug.includes(q)
            );
        }
        return NextResponse.json(filtered, { headers: CORS_HEADERS });
    }

    // Public view: only published
    const result = getPublishedContents({ category: category || undefined, status: 'published', search, page, pageSize });
    return NextResponse.json(result, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { authorId = 'usr-001', ...data } = body;

        const content = createContent({
            ...data,
            authorId,
            tags: data.tags || [],
            status: data.status || 'draft',
        });

        return NextResponse.json(content, { status: 201, headers: CORS_HEADERS });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: CORS_HEADERS });
    }
}
