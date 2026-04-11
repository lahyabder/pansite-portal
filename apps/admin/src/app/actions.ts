'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin } from '@pan/shared';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function deleteContentAction(id: string) {
    const { error } = await getSupabaseAdmin()
        .from('contents')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
    
    if (error) throw new Error(error.message);
    revalidatePath('/contents');
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

export async function uploadAssetAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('Aucun fichier sélectionné');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`;

    const { data, error } = await getSupabaseAdmin()
        .storage
        .from('pan-images')
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false
        });

    if (error) throw new Error(error.message);

    // Return the public URL
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    return `${url}/storage/v1/object/public/pan-images/${filename}`;
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

// ─── AI Actions ──────────────────────────────────────────────────────────────

export async function translateContentAction(text: string, targetLanguage: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Clé API OpenAI non configurée");
    }
    
    // We expect targetLanguage to be a label like "arabe", "anglais", "espagnol"
    const langNames: Record<string, string> = {
        'fr': 'français',
        'ar': 'arabe',
        'en': 'anglais',
        'es': 'espagnol'
    };
    
    const targetName = langNames[targetLanguage] || targetLanguage;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Tu es un expert traducteur professionnel. Traduis le texte suivant en ${targetName}. Le résultat doit être direct, sans commentaires ni guillemets ajoutés.
                    
RÈGLE STRICTE ET OBLIGATOIRE :
Le nom du Directeur Général doit TOUJOURS être traduit exactement comme suit, sans exception :
- En Arabe : "أحمد ولد سيد احمد ولد اج"
- En Français, Anglais, et Espagnol : "Ahmed Ould Sid’Ahmed Ould DIÉ"`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.2,
        });

        return response.choices[0]?.message?.content?.trim() || text;
    } catch (error) {
        console.error("Erreur de traduction:", error);
        throw new Error("La traduction a échoué.");
    }
}

export async function translateFullContentAction(payload: any, sourceLang: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Clé API OpenAI non configurée");
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'system',
                    content: `Tu es un système de traduction multilingue intelligent. 
On te fournit un objet JSON représentant un article (titre, extrait, corps).
L'objet a cette structure:
{
  "title": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
  "excerpt": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
  "body": { "fr": "...", "ar": "...", "en": "...", "es": "..." }
}

La langue source principale est: "${sourceLang}".
Ta mission est de traduire les textes de la langue source vers les autres langues (fr, ar, en, es) UNIQUEMENT SI LE CHAMP CIBLE EST VIDE "".

RÈGLES STRICTES ET OBLIGATOIRES DE TRADUCTION :
1. Le nom du Directeur Général doit TOUJOURS être traduit exactement comme suit, sans exception :
   - En Arabe : "أحمد ولد سيد احمد ولد اج"
   - En Français, Anglais, et Espagnol : "Ahmed Ould Sid’Ahmed Ould DIÉ"

- Ne modifie JAMAIS un texte qui est déjà rempli.
- Respecte parfaitement le formatage (retours à la ligne, paragraphes).
- Renvoie UNIQUEMENT l'objet JSON complet et mis à jour.`
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        title: payload.title,
                        excerpt: payload.excerpt,
                        body: payload.body
                    })
                }
            ],
            temperature: 0.1,
        });

        const resultText = response.choices[0]?.message?.content;
        if (!resultText) return payload;

        const resultJson = JSON.parse(resultText);
        
        // Merge the results safely
        return {
            ...payload,
            title: resultJson.title || payload.title,
            excerpt: resultJson.excerpt || payload.excerpt,
            body: resultJson.body || payload.body
        };
    } catch (error) {
        console.error("Erreur de traduction globale:", error);
        throw new Error("La traduction intelligente a échoué.");
    }
}
