import type { Content, ContentCategory, ContentStatus, ContentFilters, PaginatedResult, AuditLogEntry, AuditAction } from '../types';
import { getSupabase, getSupabaseAdmin } from '../supabase';

/**
 * Supabase-backed content repository.
 * Replaced JSON persistence with real-time database access.
 */

function now() {
    return new Date().toISOString();
}

// ─── Helpers ──────────────────────────────────────────────
function mapToContent(row: any): Content {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        excerpt: row.excerpt,
        coverImage: row.cover_image,
        category: row.category as ContentCategory,
        tags: row.tags || [],
        status: row.status as ContentStatus,
        priority: row.priority,
        authorId: row.author_id,
        eventDate: row.event_date,
        eventEndDate: row.event_end_date,
        eventLocation: row.event_location,
        images: row.images || [],
        externalLink: row.external_link,
        videoLink: row.video_link,
        expiresAt: row.expires_at,
        publishedAt: row.published_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        deletedAt: row.deleted_at,
    };
}

function mapToRow(content: Partial<Content>) {
    const row: any = {};
    if (content.slug !== undefined) row.slug = content.slug;
    if (content.title !== undefined) row.title = content.title;
    if (content.body !== undefined) row.body = content.body;
    if (content.excerpt !== undefined) row.excerpt = content.excerpt;
    if (content.coverImage !== undefined) row.cover_image = content.coverImage;
    if (content.category !== undefined) row.category = content.category;
    if (content.tags !== undefined) row.tags = content.tags;
    if (content.status !== undefined) row.status = content.status;
    if (content.priority !== undefined) row.priority = content.priority;
    if (content.authorId !== undefined) row.author_id = content.authorId;
    if (content.eventDate !== undefined) row.event_date = content.eventDate;
    if (content.eventEndDate !== undefined) row.event_end_date = content.eventEndDate;
    if (content.eventLocation !== undefined) row.event_location = content.eventLocation;
    if (content.images !== undefined) row.images = content.images;
    if (content.externalLink !== undefined) row.external_link = content.externalLink;
    if (content.videoLink !== undefined) row.video_link = content.videoLink;
    if (content.expiresAt !== undefined) row.expires_at = content.expiresAt;
    if (content.publishedAt !== undefined) row.published_at = content.publishedAt;
    if (content.updatedAt !== undefined) row.updated_at = content.updatedAt;
    if (content.deletedAt !== undefined) row.deleted_at = content.deletedAt;
    return row;
}

// ─── Read ─────────────────────────────────────────────────
export async function getAllContents(): Promise<Content[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToContent);
}

export async function getPublishedContents(filters?: ContentFilters): Promise<PaginatedResult<Content>> {
    let query = getSupabaseAdmin()
        .from('contents')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .is('deleted_at', null);

    if (filters?.category) {
        query = query.eq('category', filters.category);
    }
    if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
    }
    if (filters?.search) {
        const q = `%${filters.search.toLowerCase()}%`;
        // Supabase doesn't easily support cross-JSONB search in a single query without complex RPC or OR
        // For now, we search in the main locale (fr) title and slug
        query = query.or(`slug.ilike.${q},title->>fr.ilike.${q}`);
    }

    // Sort by publishedAt desc
    query = query.order('published_at', { ascending: false });

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 6;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const items = (data || []).map(mapToContent);
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
}

export async function getContentBySlug(slug: string): Promise<Content | undefined> {
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .is('deleted_at', null)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
    return data ? mapToContent(data) : undefined;
}

export async function getContentById(id: string): Promise<Content | undefined> {
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? mapToContent(data) : undefined;
}

export async function getContentsByCategory(category: ContentCategory): Promise<Content[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapToContent);
}

export async function getActiveAlerts(): Promise<Content[]> {
    const today = new Date().toISOString();
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .eq('category', 'alerte')
        .eq('status', 'published')
        .is('deleted_at', null)
        .or(`expires_at.is.null,expires_at.gt.${today}`);

    if (error) throw error;
    return (data || []).map(mapToContent);
}

export async function getLatestContents(limit: number = 4): Promise<Content[]> {
    const { data, error } = await getSupabaseAdmin()
        .from('contents')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return (data || []).map(mapToContent);
}

export async function getAdminContents(filters?: ContentFilters): Promise<PaginatedResult<Content>> {
    let query = getSupabaseAdmin()
        .from('contents')
        .select('*', { count: 'exact' })
        .is('deleted_at', null);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) {
        const q = `%${filters.search.toLowerCase()}%`;
        query = query.or(`slug.ilike.${q},title->>fr.ilike.${q}`);
    }

    query = query.order('updated_at', { ascending: false });

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const items = (data || []).map(mapToContent);
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return { items, total, page, pageSize, totalPages };
}

// ─── Write ────────────────────────────────────────────────
export async function createContent(data: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    const row = mapToRow({
        ...data,
        updatedAt: now(),
    });

    const { data: inserted, error } = await getSupabaseAdmin()
        .from('contents')
        .insert([row])
        .select()
        .single();

    if (error) throw error;

    const content = mapToContent(inserted);
    await addAuditEntry('content', content.id, 'create', data.authorId, getUserName(data.authorId));
    return content;
}

export async function updateContent(id: string, data: Partial<Content>, userId: string): Promise<Content | null> {
    const row = mapToRow({ ...data, updatedAt: now() });

    const { data: updated, error } = await getSupabaseAdmin()
        .from('contents')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }

    await addAuditEntry('content', id, 'update', userId, getUserName(userId));
    return mapToContent(updated);
}

export async function deleteContent(id: string, userId: string): Promise<boolean> {
    const { error } = await getSupabaseAdmin()
        .from('contents')
        .update({ deleted_at: now(), updated_at: now() })
        .eq('id', id);

    if (error) return false;
    await addAuditEntry('content', id, 'delete', userId, getUserName(userId));
    return true;
}

// ─── Workflow actions ─────────────────────────────────────
export async function submitForReview(id: string, userId: string): Promise<Content | null> {
    const content = await getContentById(id);
    if (!content || content.status !== 'draft') return null;
    return updateStatusWithAudit(id, 'pending_approval', 'submit_for_review', userId);
}

export async function approveContent(id: string, userId: string): Promise<Content | null> {
    const content = await getContentById(id);
    if (!content || content.status !== 'pending_approval') return null;
    return updateStatusWithAudit(id, 'published', 'approve', userId);
}

export async function publishContent(id: string, userId: string): Promise<Content | null> {
    const content = await getContentById(id);
    if (!content || (content.status !== 'draft' && content.status !== 'pending_approval')) return null;
    return updateStatusWithAudit(id, 'published', 'publish', userId);
}

export async function archiveContent(id: string, userId: string): Promise<Content | null> {
    const content = await getContentById(id);
    if (!content || content.status !== 'published') return null;
    return updateStatusWithAudit(id, 'archived', 'archive', userId);
}

export async function restoreContent(id: string, userId: string): Promise<Content | null> {
    const content = await getContentById(id);
    if (!content || content.status !== 'archived') return null;
    return updateStatusWithAudit(id, 'draft', 'restore', userId);
}

async function updateStatusWithAudit(
    id: string,
    newStatus: ContentStatus,
    action: AuditAction,
    userId: string,
): Promise<Content | null> {
    const { data: current } = await getSupabaseAdmin().from('contents').select('status, published_at').eq('id', id).single();
    if (!current) return null;

    const prev = current.status;
    const updates: any = {
        status: newStatus,
        updated_at: now(),
    };
    if (newStatus === 'published' && !current.published_at) {
        updates.published_at = now();
    }

    const { data: updated, error } = await getSupabaseAdmin()
        .from('contents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    await addAuditEntry('content', id, action, userId, getUserName(userId), undefined, prev, newStatus);
    return mapToContent(updated);
}

// ─── Audit log ────────────────────────────────────────────
async function addAuditEntry(
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    action: AuditAction,
    userId: string,
    userName: string,
    details?: string,
    previousStatus?: string,
    newStatus?: string,
) {
    const { error } = await getSupabaseAdmin().from('audit_log').insert([{
        entity_type: entityType,
        entity_id: entityId,
        action,
        user_id: userId,
        user_name: userName,
        details,
        previous_status: previousStatus,
        new_status: newStatus,
    }]);

    if (error) console.error('Failed to add audit entry:', error);
}

export async function getAuditLog(entityId?: string): Promise<AuditLogEntry[]> {
    let query = getSupabaseAdmin().from('audit_log').select('*').order('created_at', { ascending: false });
    if (entityId) query = query.eq('entity_id', entityId);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((row: any) => ({
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        action: row.action,
        userId: row.user_id,
        userName: row.user_name,
        details: row.details,
        previousStatus: row.previous_status,
        newStatus: row.new_status,
        createdAt: row.created_at,
    }));
}

// ─── Reset (for tests) ───────────────────────────────────
export function resetRepository() {
    // No-op for Supabase or implement a clean-up if really needed
}

// ─── Helpers ──────────────────────────────────────────────
function getUserName(userId: string): string {
    const names: Record<string, string> = {
        'usr-001': 'Ahmed Ould Mohamed',
        'usr-002': 'Fatima Mint Cheikh',
        'usr-003': 'Mohamed Salem',
    };
    return names[userId] || 'Système';
}
