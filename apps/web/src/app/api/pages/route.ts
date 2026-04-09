import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllPages, getPageBySlug, createPage, updatePage, deletePage } from '@pan/shared';

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
    const slug = searchParams.get('slug');

    if (slug) {
        const page = await getPageBySlug(slug);
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: CORS_HEADERS });
        }
        return NextResponse.json(page, { headers: CORS_HEADERS });
    }

    const pages = await getAllPages();
    return NextResponse.json(pages, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const page = await createPage(data);
        revalidatePath('/', 'layout');
        return NextResponse.json(page, { status: 201, headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}
