import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI();
const LOCALES = ['fr', 'ar', 'en', 'es'];

async function translateContent(payload: any, sourceLang: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
            {
                role: 'system',
                content: `Tu es un système de traduction multilingue intelligent.
On te fournit un objet JSON représentant un article (title, excerpt, body).
L'objet a cette structure:
{
  "title": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
  "excerpt": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
  "body": { "fr": "...", "ar": "...", "en": "...", "es": "..." }
}

La langue source principale est: "${sourceLang}".
Ta mission est de traduire les textes de la langue source vers les autres langues (fr, ar, en, es) UNIQUEMENT SI LE CHAMP CIBLE EST VIDES "".
Renvoie UNIQUEMENT l'objet JSON complet et mis à jour.`
            },
            {
                role: 'user',
                content: JSON.stringify({
                    title: payload.title || { fr: '', ar: '', en: '', es: '' },
                    excerpt: payload.excerpt || { fr: '', ar: '', en: '', es: '' },
                    body: payload.body || { fr: '', ar: '', en: '', es: '' }
                })
            }
        ],
        temperature: 0.1,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) return payload;

    const resultJson = JSON.parse(resultText);
    return {
        ...payload,
        title: resultJson.title || payload.title,
        excerpt: resultJson.excerpt || payload.excerpt,
        body: resultJson.body || payload.body
    };
}

async function run() {
  const { data: contents, error } = await supabase.from('contents').select('*');
  if (error) throw error;
  
  console.log(`Found ${contents.length} contents to check.`);

  for (const item of contents) {
    let sourceLang = 'fr';
    if (item.title?.ar && !item.title?.fr) sourceLang = 'ar';
    
    // Check if it needs translation
    let needsTranslation = false;
    for (const loc of LOCALES) {
      if (!item.title?.[loc] || !item.excerpt?.[loc]) {
        needsTranslation = true;
        break;
      }
    }

    if (needsTranslation) {
      console.log(`Translating: ${item.slug}...`);
      const trans = await translateContent(item, sourceLang);
      
      const { error: updateErr } = await supabase.from('contents').update({
        title: trans.title,
        excerpt: trans.excerpt,
        body: trans.body
      }).eq('id', item.id);
      
      if (updateErr) {
        console.error(`Failed to update ${item.slug}:`, updateErr);
      } else {
        console.log(`Successfully translated and updated ${item.slug}`);
      }
    } else {
      console.log(`Skipping ${item.slug}, already translated.`);
    }
  }
}

run().catch(console.error);
