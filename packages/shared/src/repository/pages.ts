import type { Page, ContentStatus, ContentFilters, PaginatedResult } from '../types';
import { getSupabaseAdmin } from '../supabase';

const LIST_COLUMNS = 'id, slug, title, description, status, published_at, created_at, updated_at';

function mapToPage(row: any): Page {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        hero: row.hero || {},
        blocks: row.blocks || [],
        seo: row.seo || {},
        status: row.status as ContentStatus,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapToRow(page: Partial<Page>) {
    const row: any = {};
    if (page.slug !== undefined) row.slug = page.slug;
    if (page.title !== undefined) row.title = page.title;
    if (page.description !== undefined) row.description = page.description;
    if (page.hero !== undefined) row.hero = page.hero;
    if (page.blocks !== undefined) row.blocks = page.blocks;
    if (page.seo !== undefined) row.seo = page.seo;
    if (page.status !== undefined) row.status = page.status;
    if (page.publishedAt !== undefined) row.published_at = page.publishedAt;
    if (page.updatedAt !== undefined) row.updated_at = new Date().toISOString();
    return row;
}

export async function getAllPages(): Promise<Page[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToPage);
}

export async function getPageBySlug(slug: string): Promise<Page | undefined> {
    const { data, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? mapToPage(data) : undefined;
}

export async function createPage(data: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Promise<Page> {
    const row = mapToRow({
        ...data,
    });

    const { data: inserted, error } = await getSupabaseAdmin()
        .from('pages')
        .insert([row])
        .select()
        .single();

    if (error) throw error;
    return mapToPage(inserted);
}

export async function updatePage(id: string, data: Partial<Page>): Promise<Page | null> {
    const row = mapToRow(data);

    const { data: updated, error } = await getSupabaseAdmin()
        .from('pages')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    return mapToPage(updated);
}

export async function deletePage(id: string): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
        .from('pages')
        .delete()
        .eq('id', id);

    return !error;
}
