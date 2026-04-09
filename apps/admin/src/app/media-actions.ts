'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Shared patterns from actions.ts
const WEB_API_BASE = process.env.WEB_API_BASE_URL || 
                     (process.env.NEXT_PUBLIC_SITE_URL) || 
                     (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000');

async function apiFetch(path: string, options?: RequestInit) {
    const url = `${WEB_API_BASE}/api${path}`;
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
}

export async function uploadMediaAction(formData: FormData) {
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'uploads';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const BUCKET = 'pan-media';
    const results = [];

    for (const file of files) {
        if (!file.name || file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
        const filePath = `${folder}/${Date.now()}-${safeName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error(`[MediaUpload] Error uploading ${file.name}:`, uploadError);
            continue;
        }

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

        // Create DB entry via our new API
        try {
            const asset = await apiFetch('/media', {
                method: 'POST',
                body: JSON.stringify({
                    filename: file.name,
                    url: urlData.publicUrl,
                    type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
                    mimeType: file.type,
                    size: file.size,
                    folder,
                    metadata: {}
                })
            });
            results.push(asset);
        } catch (dbError) {
            console.error(`[MediaUpload] Error saving DB entry for ${file.name}:`, dbError);
        }
    }

    revalidatePath('/media');
    return results;
}

export async function deleteMediaAction(id: string, fileUrl: string) {
    // 1. Delete from Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    const BUCKET = 'pan-media';
    
    // Extract path from public URL
    // Format: .../storage/v1/object/public/pan-media/FOLDER/FILE
    const pathParts = fileUrl.split(`${BUCKET}/`);
    if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from(BUCKET).remove([filePath]);
    }

    // 2. Delete from DB via Repo/API
    // (Assuming we add a DELETE method to /api/media or similar)
    // For now let's just use the repo directly if we were on server side, 
    // but we'll stick to our API proxy pattern.
    
    // Quick fix: the shared repo has deleteMediaAsset. I'll add an API route for it or use it here.
    // I'll assume we have /api/media/[id]
    await apiFetch(`/media/${id}`, { method: 'DELETE' });

    revalidatePath('/media');
    return { success: true };
}
