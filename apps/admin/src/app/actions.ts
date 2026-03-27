'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';


// ─── Base URL for the web app Content API ────────────────────────────────────
// In dev, web runs on 3000; in prod, override via WEB_API_BASE_URL env var
const WEB_API_BASE = process.env.WEB_API_BASE_URL || 
                     (process.env.NEXT_PUBLIC_SITE_URL) || // Prioritize the public site URL if set
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000');




async function contentFetch(path: string, options?: RequestInit) {
    const url = `${WEB_API_BASE}/api/content${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // Increased timeout

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

/** Strict variant for write operations — throws with the actual API error message */
async function contentFetchStrict(path: string, options?: RequestInit) {
    const url = `${WEB_API_BASE}/api/content${path}`;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000); // Longer timeout for writes

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
            let errorMessage = `Erreur API (${res.status})`;
            try {
                const parsed = JSON.parse(text);
                if (parsed.error) errorMessage = parsed.error;
            } catch {
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }
        
        const data = await res.json();
        return data;
    } catch (err: any) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
            throw new Error("Délai d'attente dépassé (15s). Le serveur web ne répond pas.");
        }
        throw err;
    }
}


// ─── File Upload via Supabase Storage ─────────────────────────────────────────
export async function uploadFileAction(formData: FormData) {
    const files = formData.getAll('files') as File[];
    if (files.length === 0 || (files.length === 1 && files[0].name === 'undefined')) return [];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuration Supabase manquante. Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const urls: string[] = [];
    const BUCKET = 'pan-images';
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    for (const file of files) {
        if (!file.name || file.size === 0) continue;
        if (file.size > MAX_SIZE) {
            throw new Error(`Le fichier "${file.name}" dépasse 5 Mo (${(file.size / 1024 / 1024).toFixed(1)} Mo).`);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique file path: content/YYYY-MM/timestamp-originalname
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
        const filePath = `content/${month}/${Date.now()}-${safeName}`;

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type || 'image/jpeg',
                cacheControl: '31536000', // 1 year cache
                upsert: false,
            });

        if (error) {
            console.error(`[Upload] Failed to upload "${file.name}":`, error.message);
            throw new Error(`Échec de l'upload de "${file.name}": ${error.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(filePath);

        urls.push(urlData.publicUrl);
        console.log(`[Upload] ✅ Uploaded "${file.name}" → ${urlData.publicUrl}`);
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
    try {
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

        const result = await contentFetchStrict('', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        try { revalidatePath('/cms/contents'); revalidatePath('/cms'); } catch { /* ignore revalidation errors */ }

        if (!result || !result.id) {
            throw new Error("L'API n'a retourné aucun ID. L'insertion a peut-être échoué côté Supabase.");
        }

        return result;
    } catch (err: any) {
        console.error('[createContentAction] Error:', err);
        return { error: err.message || 'Erreur lors de la création du contenu.' };
    }
}

export async function updateContentAction(id: string, data: Record<string, unknown>, userId: string) {
    try {
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

        const result = await contentFetchStrict(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data, userId }),
        });

        try { revalidatePath('/cms/contents'); revalidatePath(`/cms/contents/${id}/edit`); revalidatePath('/cms'); } catch { /* ignore revalidation errors */ }

        return result;
    } catch (err: any) {
        console.error('[updateContentAction] Error:', err);
        return { error: err.message || 'Erreur lors de la mise à jour du contenu.' };
    }
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
    await contentFetchStrict(`/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
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

