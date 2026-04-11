import OpenAI from 'openai';
import { config } from 'dotenv';
config({ path: 'apps/admin/.env.local' });

const openai = new OpenAI();

async function run() {
  const payload = {
    title: { ar: 'زيارة رئيس الجمهورية للميناء', fr: '', en: '', es: '' },
    excerpt: { ar: 'تمت الزيارة يوم الخميس للإطلاع على التوسعة الجديدة', fr: '', en: '', es: '' },
    body: { ar: 'أجرى رئيس الجمهورية زيارة ميدانية ناجحة حيث التقى بالعمال واطلع على المشاريع قيد الإنجاز. وأكد على أهمية الميناء في الاقتصاد الوطني.', fr: '', en: '', es: '' }
  };
  
  const sourceLang = 'ar';
  
  console.log('Sending request to OpenAI...');
  
  const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [
          {
              role: 'system',
              content: `Tu es un système de traduction multilingue intelligent. 
On te fournit un objet JSON représentant un article (titre, extrait, corps).
L'objet a cette structure:
{
"title": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
"excerpt": { "fr": "...", "ar": "...", "en": "...", "es": "..." },
"body": { "fr": "...", "ar": "...", "en": "...", "es": "..." }
}

La langue source principale est: "${sourceLang}".
Ta mission est de traduire les textes de la langue source vers les autres langues (fr, ar, en, es) UNIQUEMENT SI LE CHAMP CIBLE EST VIDE "".
- Ne modifie JAMAIS un texte qui est déjà rempli.
- Respecte parfaitement le formatage (retours à la ligne, paragraphes).
- Renvoie UNIQUEMENT l'objet JSON complet et mis à jour.`
          },
          {
              role: 'user',
              content: JSON.stringify({
                  title: payload.title,
                  excerpt: payload.excerpt,
                  body: payload.body
              })
          }
      ],
      temperature: 0.1,
  });

  console.log(response.choices[0]?.message?.content);
}
run();
