'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email et mot de passe requis' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Email ou mot de passe incorrect.' };
  }

  redirect('/');
}

export async function signOutAction(scope: 'local' | 'global' | 'others' = 'local') {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope });
    redirect('/login');
}
