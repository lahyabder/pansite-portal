/// <reference types="node" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Get public Supabase client.
 * Safe for both client and server side.
 */
export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (!url || !key) {
            // During static generation (build), we return a dummy client to avoid crashing.
            // In a real environment, this would log a warning.
            _supabase = createClient('https://placeholder-project.supabase.co', 'placeholder-key');
        } else {
            _supabase = createClient(url, key);
        }
    }
    return _supabase;
}

/**
 * Get admin Supabase client (Service Role).
 * ONLY for server-side execution.
 */
export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (!url || !key) {
            // Build-safe: Return a dummy client instead of throwing.
            // This prevents Next.js from crashing during the 'Collecting page data' phase.
            _supabaseAdmin = createClient('https://placeholder-project.supabase.co', 'placeholder-key', {
                auth: { autoRefreshToken: false, persistSession: false }
            });
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
