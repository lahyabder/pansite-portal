import { createClient } from '/tmp/sb_tmp/node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
    'https://xubtnnyhnkhcjmjwordx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnRubnlobmtoY2ptandvcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxMTU0OCwiZXhwIjoyMDg5Mzg3NTQ4fQ.flfjIWLssU4Qw2vepDLh3Mfd66fZmhCqsqHJZpO-j_0'
);

// Check all data in settings table
const { data, error } = await supabase.from('settings').select('*');
console.log('Error:', JSON.stringify(error));
console.log('Rows:', JSON.stringify(data, null, 2));
