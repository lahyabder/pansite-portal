import { NextRequest, NextResponse } from 'next/server';
import { getFilteredRequests, getRequestById, createRequest, assignRequest, changeRequestStatus, respondToRequest, getRequestStats } from '@/shared_lib';
import type { RequestStatus, RequestType, RequestPriority, DocumentDirection } from '@/shared_lib';

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
    const id = searchParams.get('id');
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
        const data = await getRequestStats();
        return NextResponse.json(data, { headers: CORS_HEADERS });
    }

    if (id) {
        const item = await getRequestById(id);
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
        return NextResponse.json(item, { headers: CORS_HEADERS });
    }

    const filters = {
        search: searchParams.get('search') || undefined,
        type: searchParams.get('type') as RequestType || undefined,
        status: searchParams.get('status') as RequestStatus || undefined,
        priority: searchParams.get('priority') as RequestPriority || undefined,
        department: searchParams.get('department') as DocumentDirection || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        pageSize: parseInt(searchParams.get('pageSize') || '20'),
    };

    const result = await getFilteredRequests(filters);
    return NextResponse.json(result, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'create') {
            const data = await createRequest(body.data);
            return NextResponse.json(data, { status: 201, headers: CORS_HEADERS });
        }

        if (action === 'assign') {
            const { id, userId, userName, department, changedBy } = body.data;
            const data = await assignRequest(id, userId, userName, department, changedBy);
            return NextResponse.json(data, { headers: CORS_HEADERS });
        }

        if (action === 'status_change') {
            const { id, newStatus, comment, userId, userName } = body.data;
            const data = await changeRequestStatus(id, newStatus, comment, userId, userName);
            return NextResponse.json(data, { headers: CORS_HEADERS });
        }

        if (action === 'respond') {
            const { id, response, userId, userName } = body.data;
            const data = await respondToRequest(id, response, userId, userName);
            return NextResponse.json(data, { headers: CORS_HEADERS });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: CORS_HEADERS });
    } catch (err: any) {
        console.error('[POST /api/requests]', err);
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}
