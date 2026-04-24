import { createClient } from '/tmp/sb_tmp/node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
    'https://xubtnnyhnkhcjmjwordx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnRubnlobmtoY2ptandvcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxMTU0OCwiZXhwIjoyMDg5Mzg3NTQ4fQ.flfjIWLssU4Qw2vepDLh3Mfd66fZmhCqsqHJZpO-j_0',
    { auth: { autoRefreshToken: false, persistSession: false } }
);

const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@pan.mr',
    password: 'PAN@Admin2026',
    email_confirm: true,
    user_metadata: { role: 'admin', name: 'Super Admin PAN' }
});

if (error) {
    console.error('Error:', error.message);
} else {
    console.log('✅ Admin créé avec succès!');
    console.log('Email:', data.user.email);
    console.log('Role:', data.user.user_metadata.role);
}
