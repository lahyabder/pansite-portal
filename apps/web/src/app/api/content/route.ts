import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllContents, getPublishedContents, createContent, getContentBySlug, getAdminContents } from '@pan/shared';
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
    const slug = searchParams.get('slug');

    if (slug) {
        const item = await getContentBySlug(slug);
        if (!item || (!admin && item.status !== 'published')) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404, headers: CORS_HEADERS });
        }
        return NextResponse.json(item, { headers: CORS_HEADERS });
    }

    if (admin) {
        // Admin view: use the new admin repository function
        const result = await getAdminContents({ 
            category: category || undefined, 
            status: status || undefined, 
            search, 
            page, 
            pageSize 
        });
        return NextResponse.json(result, { headers: CORS_HEADERS });
    }

    // Public view: only published
    const result = await getPublishedContents({ 
        category: category || undefined, 
        status: 'published', 
        search, 
        page, 
        pageSize 
    });
    return NextResponse.json(result, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { authorId = 'usr-001', ...data } = body;

        const status = data.status || 'draft';

        // Auto-set publishedAt when publishing directly and no date is provided
        if (status === 'published' && !data.publishedAt) {
            data.publishedAt = new Date().toISOString();
        }

        const content = await createContent({
            ...data,
            authorId,
            tags: data.tags || [],
            status,
        });

        // Force Web App cache invalidation
        revalidatePath('/', 'layout');

        return NextResponse.json(content, { status: 201, headers: CORS_HEADERS });
    } catch (err: any) {
        console.error('[POST /api/content]', err);
        return NextResponse.json({ error: err.message || 'Invalid request' }, { status: 400, headers: CORS_HEADERS });
    }
}

