import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI();

async function translateJson(payload: any, sourceLang: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        messages: [
            {
                role: 'system',
                content: `Tu es un système de traduction JSON intelligent.
On te fournit un objet JSON représentant les données d'une page (blocks).
La langue source principale est le français (fr).
Ta mission est de parcourir le JSON, et pour chaque objet contenant des clés de langues (fr, ar) mais manquant 'en' ou 'es', tu dois traduire le contenu du 'fr' vers 'en' et 'es'.
Ne modifie pas l'architecture du JSON, et garde toutes les clés originales intactes.
Renvoie UNIQUEMENT l'objet mis à jour dans ce format: { "blocks": [...] }`
            },
            {
                role: 'user',
                content: JSON.stringify({ blocks: payload })
            }
        ],
        temperature: 0.1,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) return payload;

    const resultJson = JSON.parse(resultText);
    return resultJson.blocks || payload;
}

async function run() {
  const { data: pages, error } = await supabase.from('pages').select('*');
  if (error) throw error;
  
  console.log(`Found ${pages.length} pages to check.`);

  for (const item of pages) {
    if (item.blocks && Array.isArray(item.blocks)) {
      console.log(`Translating blocks for page: ${item.slug}...`);
      const updatedBlocks = await translateJson(item.blocks, 'fr');
      
      const { error: updateErr } = await supabase.from('pages').update({
        blocks: updatedBlocks
      }).eq('id', item.id);
      
      if (updateErr) {
        console.error(`Failed to update ${item.slug}:`, updateErr);
      } else {
        console.log(`Successfully translated and updated ${item.slug}`);
      }
    }
  }
}

run().catch(console.error);
