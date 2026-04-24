import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://xubtnnyhnkhcjmjwordx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnRubnlobmtoY2ptandvcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxMTU0OCwiZXhwIjoyMDg5Mzg3NTQ4fQ.flfjIWLssU4Qw2vepDLh3Mfd66fZmhCqsqHJZpO-j_0'
);

// 1. Get current settings
const { data: current, error: fetchErr } = await supabase
    .from('settings')
    .select('id, social_links')
    .limit(1)
    .maybeSingle();

if (fetchErr) { console.error('Fetch error:', fetchErr); process.exit(1); }
if (!current) { console.error('No settings row found!'); process.exit(1); }

console.log('Current social_links:', current.social_links);

// 2. Merge LinkedIn into existing social links
const updatedLinks = {
    ...(current.social_links || {}),
    linkedin: 'https://www.linkedin.com/in/port-autonome-ndb-a6365a405/'
};

// 3. Update
const { error: updateErr } = await supabase
    .from('settings')
    .update({ social_links: updatedLinks, updated_at: new Date().toISOString() })
    .eq('id', current.id);

if (updateErr) { console.error('Update error:', updateErr); process.exit(1); }

console.log('✅ LinkedIn added successfully!');
console.log('Updated social_links:', updatedLinks);
