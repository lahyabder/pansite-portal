import type { MediaAsset } from '../types';
import { getSupabaseAdmin } from '../supabase';

function mapToMedia(row: any): MediaAsset {
    return {
        id: row.id,
        filename: row.filename,
        url: row.url,
        type: row.type as 'image' | 'video' | 'document' | 'other',
        mimeType: row.mime_type,
        size: row.size,
        metadata: row.metadata || {},
        folder: row.folder,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapToRow(media: Partial<MediaAsset>) {
    const row: any = {};
    if (media.filename !== undefined) row.filename = media.filename;
    if (media.url !== undefined) row.url = media.url;
    if (media.type !== undefined) row.type = media.type;
    if (media.mimeType !== undefined) row.mime_type = media.mimeType;
    if (media.size !== undefined) row.size = media.size;
    if (media.metadata !== undefined) row.metadata = media.metadata;
    if (media.folder !== undefined) row.folder = media.folder;
    row.updated_at = new Date().toISOString();
    return row;
}

export async function getAllMedia(filters?: { type?: string; folder?: string }): Promise<MediaAsset[]> {
    let query = getSupabaseAdmin()
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.folder) query = query.eq('folder', filters.folder);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapToMedia);
}

export async function createMediaAsset(data: Omit<MediaAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaAsset> {
    const row = mapToRow(data as any);
    const { data: inserted, error } = await getSupabaseAdmin()
        .from('media_assets')
        .insert([row])
        .select()
        .single();

    if (error) throw error;
    return mapToMedia(inserted);
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
        .from('media_assets')
        .delete()
        .eq('id', id);

    return !error;
}
