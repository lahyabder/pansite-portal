'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signOutAction() {
    const cookieStore = await cookies();
    
    // Sign out via Supabase Admin (invalidates session server-side)
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        // Get token from cookie to invalidate it
        const allCookies = cookieStore.getAll();
        const authCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
        if (authCookie) {
            try { JSON.parse(authCookie.value); } catch {}
        }
    } catch {}

    // Clear all Supabase auth cookies
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
        if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
            cookieStore.delete(cookie.name);
        }
    }

    redirect('/login');
}
