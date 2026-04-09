import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteSettings, updateSiteSettings } from '@pan/shared';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
    const settings = await getSiteSettings();
    return NextResponse.json(settings || null, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const settings = await updateSiteSettings(data);
        revalidatePath('/', 'layout');
        return NextResponse.json(settings, { status: 200, headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}
