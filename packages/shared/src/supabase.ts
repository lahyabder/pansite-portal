/// <reference types="node" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (!url || !key) {
            console.warn('⚠️ Supabase public credentials are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
            // During static generation (build), we might want to return a dummy or throw.
            // But with force-dynamic, this shouldn't be hit at build time.
            if (typeof window === 'undefined') {
                 // Throw to catch it in Vercel logs if we accidentally hit it at build time
                 throw new Error('Supabase credentials missing during server-side execution.');
            }
            _supabase = createClient('http://placeholder-url.com', 'placeholder-key');
        } else {
            _supabase = createClient(url, key);
        }
    }
    return _supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (!url || !key) {
            console.warn('⚠️ Supabase admin credentials are missing. Check SUPABASE_SERVICE_ROLE_KEY.');
            if (typeof window === 'undefined') {
                throw new Error('Supabase admin credentials missing during server-side execution.');
            }
            _supabaseAdmin = createClient('http://placeholder-url.com', 'placeholder-key');
        } else {
            _supabaseAdmin = createClient(url, key, {
                auth: { autoRefreshToken: false, persistSession: false }
            });
        }
    }
    return _supabaseAdmin;
}

/** Get the public URL for a file in the pan-images bucket */
export function getStorageUrl(path: string): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    return `${url}/storage/v1/object/public/pan-images/${path}`;
}
