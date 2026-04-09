import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePage, deletePage } from '@pan/shared';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await req.json();
        const page = await updatePage(id, data);
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404, headers: CORS_HEADERS });
        }
        revalidatePath('/', 'layout');
        return NextResponse.json(page, { headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const success = await deletePage(id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success }, { headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}

