import { createClient } from '/tmp/sb_tmp/node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
    'https://xubtnnyhnkhcjmjwordx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnRubnlobmtoY2ptandvcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxMTU0OCwiZXhwIjoyMDg5Mzg3NTQ4fQ.flfjIWLssU4Qw2vepDLh3Mfd66fZmhCqsqHJZpO-j_0',
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// List existing users
const { data: list } = await supabase.auth.admin.listUsers();
console.log('Existing users:', list?.users?.map(u => ({ email: u.email, role: u.user_metadata?.role })));
