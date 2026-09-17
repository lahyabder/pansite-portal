const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('No Supabase credentials');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing insert...');
  const { data, error } = await supabase
    .from('contents')
    .insert([{
      slug: 'test-hang',
      title: { fr: 'Test' },
      body: { fr: 'Test body' },
      category: 'actualite',
      status: 'draft',
      cover_image: 'https://example.com/image.png',
      images: [],
      tags: [],
      author_id: 'usr-001',
      updated_at: new Date().toISOString()
    }]);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}
test();
