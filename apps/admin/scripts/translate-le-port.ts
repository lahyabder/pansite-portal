import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI();
const LOCALES = ['fr', 'ar', 'en', 'es'];

async function translateJson(payload: any, sourceLang: string) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o', 
        response_format: { type: "json_object" },
        messages: [
            {
                role: 'system',
                content: `Tu es un système de traduction JSON basé sur l'IA.
On te fournit un objet JSON représentant les données de la page "Le Port" (blocks). Le bloc en question contient souvent des textes mélangés.
La langue de base est le français (fr).
Ton objectif :
Parcourir L'ENSEMBLE du JSON. Dès que tu vois un composant avec des champs traduits (titre, sous-titre, description, etc.), tu dois RÉÉCRIRE et TRADUIRE PROPREMENT l'ensemble des langues (ar, en, es) en te basant UNIQUEMENT sur la version française 'fr'.
- En 'ar', il ne doit y avoir QUE de l'arabe (traduis par ex "PHOTOGRAPHIE ORIGINALE DES PREMIÈRES INSTALLATIONS PORTUAIRES" en "صورة أصلية للمنشآت المينائية الأولى").
- En 'en', que de l'anglais.
- En 'es', que de l'espagnol.
- Ne modifie pas la structure ni les clés, uniquement les valeurs de type chaîne.
Écrase toutes les valeurs précédentes de 'ar' etc. si elles contenaient du texte mixte.
Renvoie UNIQUEMENT le JSON final mis à jour sous la forme { "blocks": [...] }`
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
  const { data: page, error } = await supabase.from('pages').select('*').eq('slug', 'le-port').single();
  if (error) throw error;
  
  if (page.blocks && Array.isArray(page.blocks)) {
    console.log(`Translating blocks for page: le-port avec écrasement complet...`);
    const updatedBlocks = await translateJson(page.blocks, 'fr');
    
    const { error: updateErr } = await supabase.from('pages').update({
      blocks: updatedBlocks
    }).eq('id', page.id);
    
    if (updateErr) {
      console.error(`Failed to update:`, updateErr);
    } else {
      console.log(`Successfully translated and updated le-port without mixed languages!`);
    }
  }
}

run().catch(console.error);
