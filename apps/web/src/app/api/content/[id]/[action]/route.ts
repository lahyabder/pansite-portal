import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { publishContent, archiveContent, restoreContent, submitForReview, approveContent } from '@/shared_lib';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; action: string }> }
) {
    const { id, action } = await params;
    let body: { userId?: string } = {};
    try { body = await req.json(); } catch { /* body is optional */ }
    const userId = body.userId || 'usr-001';

    let result;
    switch (action) {
        case 'publish':
            result = await publishContent(id, userId);
            break;
        case 'approve':
            result = await approveContent(id, userId);
            break;
        case 'archive':
            result = await archiveContent(id, userId);
            break;
        case 'restore':
            result = await restoreContent(id, userId);
            break;
        case 'submit':
            result = await submitForReview(id, userId);
            break;
        default:
            return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400, headers: CORS_HEADERS });
    }


    if (!result) {
        return NextResponse.json({ error: 'Action failed — check content status' }, { status: 422, headers: CORS_HEADERS });
    }

    // Force Web App cache invalidation
    revalidatePath('/', 'layout');

    return NextResponse.json(result, { headers: CORS_HEADERS });
}

