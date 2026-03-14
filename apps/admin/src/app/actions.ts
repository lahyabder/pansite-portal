'use server';

import {
    updateGedDocument,
    deleteGedDocument,
    createGedDocument,
} from '@pan/shared';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { OpenAI } from 'openai';

// ─── Base URL for the web app Content API ────────────────────────────────────
// In dev, web runs on 3000; in prod, override via WEB_API_BASE_URL env var
const WEB_API_BASE = process.env.WEB_API_BASE_URL || 'http://localhost:3000';

async function contentFetch(path: string, options?: RequestInit) {
    const url = `${WEB_API_BASE}/api/content${path}`;
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        cache: 'no-store',
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Content API error ${res.status}: ${text}`);
    }
    return res.json();
}

// ─── File Upload ──────────────────────────────────────────────────────────────
export async function uploadFileAction(formData: FormData) {
    const files = formData.getAll('files') as File[];
    if (files.length === 0 || (files.length === 1 && files[0].name === 'undefined')) return [];

    const urls: string[] = [];
    const uploadDir = join(process.cwd(), '..', 'web', 'public', 'uploads');

    for (const file of files) {
        if (!file.name || file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);
        urls.push(`/uploads/${fileName}`);
    }

    return urls;
}

// ─── OpenAI Translation ───────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function translateText(text: string, to: string) {
    if (!text) return '';
    const langNames: Record<string, string> = {
        ar: 'Arabic', en: 'English', es: 'Spanish', fr: 'French'
    };

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator for a Port Authority website.
Translate the following text to ${langNames[to]}.
Keep the tone professional and formal.
If the text contains HTML tags or special formatting, preserve it.
Return ONLY the translated text, nothing else.`
                },
                { role: 'user', content: text }
            ],
            temperature: 0.3,
        });
        return response.choices[0].message.content?.trim() || text;
    } catch {
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
    const targets = ['fr', 'ar', 'en', 'es'].filter(l => l !== data.sourceLang);
    const translations: Record<string, Record<string, string>> = {
        title: { [data.sourceLang]: data.title },
        excerpt: { [data.sourceLang]: data.excerpt },
        body: { [data.sourceLang]: data.body }
    };

    for (const target of targets) {
        translations.title[target] = await translateText(data.title, target);
        translations.excerpt[target] = await translateText(data.excerpt, target);
        translations.body[target] = await translateText(data.body, target);
    }

    return translations;
}

// ─── Content CRUD via Web API ─────────────────────────────────────────────────

export async function getAllContentsAction() {
    try {
        return await contentFetch('?admin=true');
    } catch {
        return [];
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

export async function deleteContentAction(id: string, userId: string) {
    await contentFetch(`/${id}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    return true;
}

// ─── GED Actions (unchanged — GED uses its own store) ────────────────────────
export async function updateDocumentAction(id: string, data: Record<string, unknown>, userId: string) {
    const result = updateGedDocument(id, data, userId);
    revalidatePath('/ged/documents');
    revalidatePath('/ged');
    return result;
}

export async function deleteDocumentAction(id: string, userId: string) {
    const result = deleteGedDocument(id, userId);
    revalidatePath('/ged/documents');
    return result;
}

export async function createDocumentAction(data: Record<string, unknown>) {
    const result = createGedDocument(data as Parameters<typeof createGedDocument>[0]);
    revalidatePath('/ged/documents');
    return result;
}
