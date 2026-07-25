import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function run() {
  const { data: contents, error } = await supabase
    .from('contents')
    .select('id, slug, title, category');

  if (error) {
    console.error("Error fetching contents:", error);
    process.exit(1);
  }

  const redirects = [];

  for (const content of contents) {
    // Only target those with 'art-' or fully numeric slugs
    if (content.slug.startsWith('art-') || /^\d+$/.test(content.slug)) {
      const title = content.title?.fr || content.title?.en || content.title?.ar || 'article';
      const baseSlug = slugify(title);
      // Adding a small random string to avoid collisions if multiple have the same name
      const newSlug = baseSlug + '-' + Math.random().toString(36).substr(2, 4);

      console.log(`Updating ${content.slug} -> ${newSlug}`);

      const { error: updateError } = await supabase
        .from('contents')
        .update({ slug: newSlug })
        .eq('id', content.id);

      if (updateError) {
        console.error("Failed to update", content.slug, updateError);
      } else {
        redirects.push({
          source: `/fr/actualites/${content.slug}`,
          destination: `/fr/actualites/${newSlug}`,
          permanent: true,
        });
        redirects.push({
          source: `/ar/actualites/${content.slug}`,
          destination: `/ar/actualites/${newSlug}`,
          permanent: true,
        });
        redirects.push({
          source: `/en/actualites/${content.slug}`,
          destination: `/en/actualites/${newSlug}`,
          permanent: true,
        });
        redirects.push({
          source: `/es/actualites/${content.slug}`,
          destination: `/es/actualites/${newSlug}`,
          permanent: true,
        });
      }
    }
  }

  console.log("----- REDIRECTS FOR next.config.ts -----");
  console.log(JSON.stringify(redirects, null, 2));
}

run();
