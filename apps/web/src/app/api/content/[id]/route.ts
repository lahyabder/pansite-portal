import { NextRequest, NextResponse } from 'next/server';
import { getContentById, updateContent, deleteContent } from '@pan/shared';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const content = getContentById(id);
    if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json(content, { headers: CORS_HEADERS });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { userId = 'usr-001', ...data } = body;
        const updated = updateContent(id, data, userId);
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
        return NextResponse.json(updated, { headers: CORS_HEADERS });
    } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400, headers: CORS_HEADERS });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId') || 'usr-001';
    const ok = deleteContent(id, userId);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}
