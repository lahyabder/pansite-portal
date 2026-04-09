import { NextRequest, NextResponse } from 'next/server';
import { getAllMedia, createMediaAsset, deleteMediaAsset } from '@pan/shared';

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
    const type = searchParams.get('type') || undefined;
    const folder = searchParams.get('folder') || undefined;

    const media = await getAllMedia({ type, folder });
    return NextResponse.json(media, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const media = await createMediaAsset(data);
        return NextResponse.json(media, { status: 201, headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}
