import { NextRequest, NextResponse } from 'next/server';
import { getAuditLog } from '@/shared_lib';

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
    const entityId = searchParams.get('entityId') || undefined;

    try {
        const data = await getAuditLog(entityId);
        return NextResponse.json(data, { headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
    }
}
