'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@pan/shared';

// ─── Pages Actions ───────────────────────────────────────────────────────────

export async function getAllPagesAction() {
    const { data, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('[getAllPagesAction] Error:', error);
        return [];
    }
    return data;
}

export async function getPageByIdAction(id: string) {
    const { data, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

export async function createPageAction(data: any) {
    const { data: page, error } = await getSupabaseAdmin()
        .from('pages')
        .insert([data])
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    revalidatePath('/pages');
    return page;
}

export async function updatePageAction(id: string, data: any) {
    const { error } = await getSupabaseAdmin()
        .from('pages')
        .update(data)
        .eq('id', id);
    
    if (error) throw new Error(error.message);
    revalidatePath('/pages');
    revalidatePath(`/pages/${id}`);
    revalidatePath('/:locale', 'layout');
    return true;
}

export async function deletePageAction(id: string) {
    const { error } = await getSupabaseAdmin()
        .from('pages')
        .delete()
        .eq('id', id);
    
    if (error) throw new Error(error.message);
    revalidatePath('/pages');
    return true;
}

// ─── Media Actions ───────────────────────────────────────────────────────────

export async function getAllMediaAction() {
    const { data, error } = await getSupabaseAdmin()
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('[getAllMediaAction] Error:', error);
        return [];
    }
    return data;
}

export async function deleteMediaAction(id: string) {
    const { error } = await getSupabaseAdmin()
        .from('media_assets')
        .delete()
        .eq('id', id);
    
    if (error) throw new Error(error.message);
    revalidatePath('/media');
    return true;
}

// ─── Settings Actions ──────────────────────────────────────────────────────────

export async function getSettingsAction() {
    const { data, error } = await getSupabaseAdmin()
        .from('site_settings')
        .select('*')
        .single();
    if (error) return null;
    return data;
}

export async function updateSettingsAction(data: any) {
    const { error } = await getSupabaseAdmin()
        .from('site_settings')
        .update(data)
        .eq('id', data.id);
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return true;
}

// ─── Menu Actions ────────────────────────────────────────────────────────────

export async function getMenuAction(location: string) {
    const { data, error } = await getSupabaseAdmin()
        .from('menus')
        .select('*')
        .eq('location', location)
        .single();
    if (error) return null;
    return data;
}

export async function updateMenuAction(id: string, data: any) {
    const { error } = await getSupabaseAdmin()
        .from('menus')
        .update(data)
        .eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return true;
}

export async function createMenuAction(data: any) {
    const { data: menu, error } = await getSupabaseAdmin()
        .from('menus')
        .insert([data])
        .select()
        .single();
    if (error) throw new Error(error.message);
    revalidatePath('/', 'layout');
    return menu;
}
