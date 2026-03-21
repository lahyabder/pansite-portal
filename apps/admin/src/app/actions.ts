'use server';

import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';


// ─── Base URL for the web app Content API ────────────────────────────────────
// In dev, web runs on 3000; in prod, override via WEB_API_BASE_URL env var
const WEB_API_BASE = process.env.WEB_API_BASE_URL || 
                     (process.env.VERCEL_URL ? 
                        (process.env.VERCEL_URL.includes('pan.afrikyia.com') || process.env.VERCEL_URL.includes('pan.mr') ? 
                            'https://www.pan.mr' : 
                            `https://www.pan.mr`) : // Default to production if in Vercel but URL is strange
                        'http://127.0.0.1:3000');



console.log('[Admin API] Base URL Initialized:', WEB_API_BASE);


async function contentFetch(path: string, options?: RequestInit) {
    const url = `${WEB_API_BASE}/api/content${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // Increased timeout

    console.log(`[Admin API] Fetching: ${url}`, { method: options?.method || 'GET' });

    try {
        const res = await fetch(url, {
            ...options,
            headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
            cache: 'no-store',
            signal: controller.signal,
        });
        clearTimeout(id);
        
        if (!res.ok) {
            const text = await res.text();
            console.error(`[Admin API] Error ${res.status} for ${url}:`, text);
            return null;
        }
        
        const data = await res.json();
        console.log(`[Admin API] Success for ${url} (${Array.isArray(data) ? data.length : '1'} items)`);
        return data;
    } catch (err: any) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
            console.error(`[Admin API] Timeout (8s) for ${url}`);
        } else {
            console.error(`[Admin API] Fetch error for ${url}:`, err.message || err);
        }
        return null;
    }
}


// ─── File Upload ──────────────────────────────────────────────────────────────
export async function uploadFileAction(formData: FormData) {
    const files = formData.getAll('files') as File[];
    if (files.length === 0 || (files.length === 1 && files[0].name === 'undefined')) return [];

    const urls: string[] = [];

    for (const file of files) {
        if (!file.name || file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert to Base64 to bypass Vercel's read-only filesystem restrictions
        // This is a temporary prototype workaround until S3/Blob is configured
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        urls.push(`data:${mimeType};base64,${base64}`);
    }

    return urls;
}

// ─── OpenAI Translation ───────────────────────────────────────────────────────
let _openai: any | null = null;

async function getOpenAIClient() {
    if (_openai) return _openai;
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('[Admin Actions] ⚠️ OPENAI_API_KEY is missing. Translations will use mock fallback [MOCK].');
        return null;
    }

    try {
        const { OpenAI } = await import('openai');
        _openai = new OpenAI({ apiKey });
        return _openai;
    } catch (err) {
        console.error('[Admin Actions] ❌ Failed to initialize OpenAI client:', err);
        return null;
    }
}

async function translateText(text: string, to: string) {
    if (!text) return '';
    const langNames: Record<string, string> = {
        ar: 'Arabic', en: 'English', es: 'Spanish', fr: 'French'
    };

    const client = await getOpenAIClient();
    if (!client) {
        return `[MOCK ${to.toUpperCase()}] ${text}`;
    }

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator for a Port Authority website.
Translate the following text to ${langNames[to]}.
Keep the tone professional and formal.
If the text contains HTML tags or special formatting, preserve it.
IMPORTANT - Fixed proper names that must NEVER be translated or changed:
- The Director General's name is always: ${to === 'ar' ? 'أحمد ولد سيد احمد ولد اج' : 'Ahmed Ould Sid Ahmed Ould Die'} (regardless of source language)
Return ONLY the translated text, nothing else.`
                },
                { role: 'user', content: text }
            ],
            temperature: 0.3,
        }, { timeout: 10000 });
        return response.choices[0].message.content?.trim() || text;
    } catch (err) {
        console.error(`[Admin Actions] ❌ Translation error to ${to}:`, err);
        const mocks: Record<string, string> = {
            ar: `[ترجمة آليا] ${text}`,
            en: `[Auto-EN] ${text}`,
            es: `[Auto-ES] ${text}`,
            fr: `[Auto-FR] ${text}`,
        };
        return mocks[to] || text;
    }
}

export async function preTranslateAction(data: {
    title: string;
    excerpt: string;
    body: string;
    sourceLang: string;
}) {
    try {
        const targets = ['fr', 'ar', 'en', 'es'].filter(l => l !== data.sourceLang);
        const translations: Record<string, Record<string, string>> = {
            title: { [data.sourceLang]: data.title },
            excerpt: { [data.sourceLang]: data.excerpt },
            body: { [data.sourceLang]: data.body }
        };

        const promises = targets.map(async (target) => {
            const [t, e, b] = await Promise.all([
                translateText(data.title, target),
                translateText(data.excerpt, target),
                translateText(data.body, target)
            ]);
            return { target, t, e, b };
        });

        const results = await Promise.all(promises);
        for (const res of results) {
            translations.title[res.target] = res.t;
            translations.excerpt[res.target] = res.e;
            translations.body[res.target] = res.b;
        }

        return translations;
    } catch (err) {
        console.error('preTranslateAction failed:', err);
        // Fallback to source only if total failure
        return {
            title: { [data.sourceLang]: data.title },
            excerpt: { [data.sourceLang]: data.excerpt },
            body: { [data.sourceLang]: data.body }
        };
    }
}

// ─── Content CRUD via Web API ─────────────────────────────────────────────────

export async function getAllContentsAction(filters?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}) {
    try {
        const params = new URLSearchParams({ admin: 'true' });
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status)   params.append('status',   filters.status);
        if (filters?.search)   params.append('search',   filters.search);
        if (filters?.page)     params.append('page',     filters.page.toString());
        if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

        const data = await contentFetch(`?${params.toString()}`);
        if (data === null) return { items: [], total: 0 };

        // Handle both array response and paginated {items, total} response
        if (Array.isArray(data)) return { items: data, total: data.length };
        return { items: data.items ?? data.data ?? [], total: data.total ?? 0 };
    } catch (err: any) {
        console.error('getAllContentsAction failed:', err);
        return { items: [], total: 0 };
    }
}


export async function getContentByIdAction(id: string) {
    try {
        return await contentFetch(`/${id}`);
    } catch {
        return null;
    }
}

export async function createContentAction(data: Record<string, unknown>) {
    if (typeof data.title === 'string') {
        const trans = await preTranslateAction({
            title: data.title as string,
            excerpt: (data.excerpt as string) || '',
            body: (data.body as string) || '',
            sourceLang: 'fr'
        });
        data.title = trans.title;
        data.excerpt = trans.excerpt;
        data.body = trans.body;
    }

    const result = await contentFetch('', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    return result;
}

export async function updateContentAction(id: string, data: Record<string, unknown>, userId: string) {
    if (typeof data.title === 'string') {
        const trans = await preTranslateAction({
            title: data.title as string,
            excerpt: (data.excerpt as string) || '',
            body: (data.body as string) || '',
            sourceLang: 'fr'
        });
        data.title = trans.title;
        data.excerpt = trans.excerpt;
        data.body = trans.body;
    }

    const result = await contentFetch(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, userId }),
    });
    revalidatePath('/cms/contents');
    revalidatePath(`/cms/contents/${id}/edit`);
    revalidatePath('/cms');
    return result;
}

export async function publishContentAction(id: string, userId: string) {
    const result = await contentFetch(`/${id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    return result;
}

// ─── Requests via Web API ───────────────────────────────────────────────────

export async function getFilteredRequestsAction(filters: any) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

    return await contentFetch(`/../requests?${params.toString()}`);
}

export async function getRequestStatsAction() {
    return await contentFetch('/../requests?stats=true');
}

export async function assignRequestAction(data: { id: string, userId: string, userName: string, department: string, changedBy: string }) {
    return await contentFetch('/../requests', {
        method: 'POST',
        body: JSON.stringify({ action: 'assign', data }),
    });
}

export async function changeRequestStatusAction(data: { id: string, newStatus: string, comment: string, userId: string, userName: string }) {
    return await contentFetch('/../requests', {
        method: 'POST',
        body: JSON.stringify({ action: 'status_change', data }),
    });
}

export async function respondToRequestAction(data: { id: string, response: string, userId: string, userName: string }) {
    return await contentFetch('/../requests', {
        method: 'POST',
        body: JSON.stringify({ action: 'respond', data }),
    });
}

// ─── Audit via Web API ──────────────────────────────────────────────────────

export async function getAuditLogAction(entityId?: string) {
    const path = entityId ? `/../audit?entityId=${entityId}` : '/../audit';
    return await contentFetch(path);
}

export async function deleteContentAction(id: string, userId: string) {
    await contentFetch(`/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    return true;
}

export async function testApiConnectionAction() {
    const results = {
        timestamp: new Date().toISOString(),
        config: {
            WEB_API_BASE,
            VERCEL_URL: process.env.VERCEL_URL || 'not-set',
            NODE_ENV: process.env.NODE_ENV,
        },
        tests: [] as any[]
    };

    // Test 1: Fetch from content API
    try {
        const start = Date.now();
        const url = `${WEB_API_BASE}/api/content?admin=true`;
        const res = await fetch(url, { cache: 'no-store' });
        const duration = Date.now() - start;
        
        results.tests.push({
            name: 'Web Content API',
            url,
            status: res.status,
            ok: res.ok,
            duration: `${duration}ms`,
            headers: Object.fromEntries(res.headers.entries())
        });
    } catch (err: any) {
        results.tests.push({
            name: 'Web Content API',
            error: err.message || 'Unknown error',
            code: err.code || 'NO_CODE',
            stack: err.stack?.split('\n').slice(0, 3).join('\n')
        });
    }

    return results;
}

