import { ContentFilters, PaginatedResult, Content } from '@pan/shared';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function getPublishedContentsAPI(filters: ContentFilters = {}): Promise<PaginatedResult<Content>> {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.status) params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());

    const url = `${API_BASE}/api/content?${params.toString()}`;
    
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('getPublishedContentsAPI failed:', err);
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    }
}

export async function getLatestContentsAPI(limit: number = 6): Promise<Content[]> {
    const data = await getPublishedContentsAPI({ pageSize: limit });
    return data.items;
}

export async function getContentBySlugAPI(slug: string): Promise<Content | null> {
    const url = `${API_BASE}/api/content?slug=${slug}`;
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('getContentBySlugAPI failed:', err);
        return null;
    }
}
