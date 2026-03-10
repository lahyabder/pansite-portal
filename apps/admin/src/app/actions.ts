'use server';

import {
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    archiveContent,
    restoreContent,
    updateGedDocument,
    deleteGedDocument,
    createGedDocument,
    getAllContents,
    getContentById
} from '@pan/shared';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFileAction(formData: FormData) {
    const files = formData.getAll('files') as File[];
    if (files.length === 0 || (files.length === 1 && files[0].name === 'undefined')) return [];

    const urls: string[] = [];
    // We target the web app's public folder so images are served directly
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

export async function getContentByIdAction(id: string) {
    return getContentById(id);
}

import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Translation Helper
async function translateText(text: string, to: string) {
    if (!text) return '';
    console.log(`[AI Translation] Translating to ${to}: ${text.slice(0, 30)}...`);

    const langNames: any = {
        ar: 'Arabic',
        en: 'English',
        es: 'Spanish',
        fr: 'French'
    };

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective and fast for translations
            messages: [
                {
                    role: "system",
                    content: `You are a professional translator for a Port Authority website. 
                    Translate the following text to ${langNames[to]}. 
                    Keep the tone professional and formal. 
                    If the text contains HTML tags or special formatting, preserve it.
                    Return ONLY the translated text, nothing else.`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.3,
        });

        const translated = response.choices[0].message.content?.trim();
        return translated || text;
    } catch (error) {
        console.error('OpenAI Translation Error:', error);
        // Fallback for demo if API fails
        const mocks: any = {
            ar: `[ترجمة آليا] ${text}`,
            en: `[Auto-EN] ${text}`,
            es: `[Auto-ES] ${text}`,
            fr: `[Auto-FR] ${text}`,
        };
        return mocks[to] || text;
    }
}

export async function preTranslateAction(data: { title: string, excerpt: string, body: string, sourceLang: string }) {
    const targets = ['fr', 'ar', 'en', 'es'].filter(l => l !== data.sourceLang);
    const translations: any = {
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

export async function getAllContentsAction() {
    return getAllContents();
}

export async function createContentAction(data: any) {
    // If fields are strings, we do a quick auto-translate (backward compatibility)
    if (typeof data.title === 'string') {
        const trans = await preTranslateAction({
            title: data.title,
            excerpt: data.excerpt,
            body: data.body,
            sourceLang: 'fr'
        });
        data.title = trans.title;
        data.excerpt = trans.excerpt;
        data.body = trans.body;
    }

    const result = createContent(data);
    revalidatePath('/cms/contents');
    revalidatePath('/');
    return result;
}

export async function updateContentAction(id: string, data: any, userId: string) {
    // If fields are strings, we do a quick auto-translate (backward compatibility)
    if (typeof data.title === 'string') {
        const trans = await preTranslateAction({
            title: data.title,
            excerpt: data.excerpt,
            body: data.body,
            sourceLang: 'fr'
        });
        data.title = trans.title;
        data.excerpt = trans.excerpt;
        data.body = trans.body;
    }

    const result = updateContent(id, data, userId);
    revalidatePath('/cms/contents');
    revalidatePath(`/cms/contents/${id}/edit`);
    revalidatePath('/cms');
    return result;
}

export async function publishContentAction(id: string, userId: string) {
    const result = publishContent(id, userId);
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    revalidatePath('/');
    return result;
}

export async function deleteContentAction(id: string, userId: string) {
    const result = deleteContent(id, userId);
    revalidatePath('/cms/contents');
    revalidatePath('/cms');
    revalidatePath('/');
    return result;
}

// GED Actions
export async function updateDocumentAction(id: string, data: any, userId: string) {
    const result = updateGedDocument(id, data, userId);
    revalidatePath('/ged/documents');
    revalidatePath('/ged');
    return result;
}
