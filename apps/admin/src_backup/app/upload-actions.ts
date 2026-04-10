'use server';

import { createClient } from '@supabase/supabase-js';

const BUCKET = 'pan-images';

/**
 * Generate a signed upload URL for direct client→Supabase upload.
 * This avoids sending file data through Vercel Server Actions (which have a 4.5 MB limit).
 */
export async function getSignedUploadUrl(fileName: string, contentType: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configuration Supabase manquante.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Generate unique file path
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const filePath = `content/${month}/${Date.now()}-${safeName}`;

    // Create a signed URL valid for 5 minutes
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(filePath);

    if (error) {
        throw new Error(`Impossible de créer un lien d'upload: ${error.message}`);
    }

    // Also prepare the public URL
    const { data: publicUrlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

    return {
        signedUrl: data.signedUrl,
        token: data.token,
        path: filePath,
        publicUrl: publicUrlData.publicUrl,
    };
}
