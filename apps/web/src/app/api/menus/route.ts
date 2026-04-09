import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllMenus, getMenuByLocation, upsertMenu } from '@pan/shared';

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
    const location = searchParams.get('location');

    if (location) {
        const menu = await getMenuByLocation(location);
        return NextResponse.json(menu || null, { headers: CORS_HEADERS });
    }

    const menus = await getAllMenus();
    return NextResponse.json(menus, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const menu = await upsertMenu(data);
        revalidatePath('/', 'layout');
        return NextResponse.json(menu, { status: 201, headers: CORS_HEADERS });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400, headers: CORS_HEADERS });
    }
}
