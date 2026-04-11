import type { Menu } from '../types';
import { getSupabaseAdmin } from '../supabase';

function mapToMenu(row: any): Menu {
    return {
        id: row.id,
        name: row.name,
        location: row.location as 'main' | 'footer' | 'header_top',
        items: row.items || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapToRow(menu: Partial<Menu>) {
    const row: any = {};
    if (menu.name !== undefined) row.name = menu.name;
    if (menu.location !== undefined) row.location = menu.location;
    if (menu.items !== undefined) row.items = menu.items;
    row.updated_at = new Date().toISOString();
    return row;
}

export async function getAllMenus(): Promise<Menu[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('menus')
        .select('*')
        .order('location', { ascending: true });

    if (error) throw error;
    return (data || []).map(mapToMenu);
}

export async function getMenuByLocation(location: string): Promise<Menu | undefined> {
    const { data, error } = await getSupabaseAdmin()
        .from('menus')
        .select('*')
        .eq('location', location)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? mapToMenu(data) : undefined;
}

export async function upsertMenu(data: Partial<Menu> & { location: string }): Promise<Menu> {
    const current = await getMenuByLocation(data.location);
    const row = mapToRow(data);

    if (!current) {
        const { data: inserted, error } = await getSupabaseAdmin()
            .from('menus')
            .insert([{ ...row, location: data.location }])
            .select()
            .single();
        if (error) throw error;
        return mapToMenu(inserted);
    } else {
        const { data: updated, error } = await getSupabaseAdmin()
            .from('menus')
            .update(row)
            .eq('id', current.id)
            .select()
            .single();
        if (error) throw error;
        return mapToMenu(updated);
    }
}
