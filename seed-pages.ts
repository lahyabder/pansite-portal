import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('apps/admin/.env.local', 'utf-8');
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    process.env[key.trim()] = values.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
});
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

import { getDictionary } from './apps/web/src/lib/dictionaries';

async function seed() {
    console.log('Fetching dictionaries...');
    const dictFr = await getDictionary('fr');
    const dictAr = await getDictionary('ar');
    const dictEn = await getDictionary('en');
    const dictEs = await getDictionary('es');

    const helperTranslate = (pathFn: (d: any) => any) => {
        return {
            fr: pathFn(dictFr) || '',
            ar: pathFn(dictAr) || '',
            en: pathFn(dictEn) || '',
            es: pathFn(dictEs) || '',
        };
    };

    const pagesData = [
        {
            slug: 'le-port',
            title: helperTranslate(d => d.pages.port.title),
            status: 'published',
            blocks: [{
                type: 'custom_page_data',
                content: {
                    subtitle: helperTranslate(d => d.pages.port.subtitle),
                    dg_word: {
                        title: helperTranslate(d => d.pages.port.dg_word.title),
                        content: helperTranslate(d => d.pages.port.dg_word.content),
                    },
                    role: {
                        title: helperTranslate(d => d.pages.port.role.title),
                        description: helperTranslate(d => d.pages.port.role.description),
                        points: dictFr.pages.port.role.points.map((_, i) => helperTranslate(d => d.pages.port.role.points[i])),
                    },
                    geography: {
                        title: helperTranslate(d => d.pages.port.geography.title),
                        description: helperTranslate(d => d.pages.port.geography.description),
                    },
                    history: {
                        title: helperTranslate(d => d.pages.port.history.title),
                        milestones: dictFr.pages.port.history.milestones.map((_, i) => ({
                            year: helperTranslate(d => d.pages.port.history.milestones[i]?.year),
                            event: helperTranslate(d => d.pages.port.history.milestones[i]?.event)
                        }))
                    },
                    evolution: {
                        title: helperTranslate(d => d.pages.port.evolution.title),
                        description: helperTranslate(d => d.pages.port.evolution.description),
                    },
                    equipment: {
                        title: helperTranslate(d => d.pages.port.equipment.title),
                        list: dictFr.pages.port.equipment.list.map((_, i) => helperTranslate(d => d.pages.port.equipment.list[i]))
                    },
                    impact: {
                        title: helperTranslate(d => d.pages.port.impact.title),
                        description: helperTranslate(d => d.pages.port.impact.description),
                        items: dictFr.pages.port.impact.items.map((_, i) => ({
                            title: helperTranslate(d => d.pages.port.impact.items[i]?.title),
                            description: helperTranslate(d => d.pages.port.impact.items[i]?.description)
                        }))
                    },
                    services: {
                        title: helperTranslate(d => d.pages.port.services.title),
                        list: dictFr.pages.port.services.list.map((_, i) => helperTranslate(d => d.pages.port.services.list[i]))
                    }
                }
            }]
        },
        {
            slug: 'infrastructures',
            title: helperTranslate(d => d.pages.infrastructure.title),
            status: 'published',
            blocks: [{
                type: 'custom_page_data',
                content: {
                    subtitle: helperTranslate(d => d.pages.infrastructure.subtitle),
                    gallery: {
                        title: helperTranslate(d => d.pages.infrastructure.gallery.title),
                        items: dictFr.pages.infrastructure.gallery.items.map((_, i) => ({
                            title: helperTranslate(d => d.pages.infrastructure.gallery.items[i]?.title),
                            description: helperTranslate(d => d.pages.infrastructure.gallery.items[i]?.description)
                        }))
                    },
                    quais: {
                        title: helperTranslate(d => d.pages.infrastructure.quais.title),
                        items: dictFr.pages.infrastructure.quais.items.map((_, i) => ({
                            name: helperTranslate(d => d.pages.infrastructure.quais.items[i]?.name),
                            info: helperTranslate(d => d.pages.infrastructure.quais.items[i]?.info),
                            length: helperTranslate(d => d.pages.infrastructure.quais.items[i]?.length),
                            draft: helperTranslate(d => d.pages.infrastructure.quais.items[i]?.draft),
                            technicalDetails: dictFr.pages.infrastructure.quais.items[i]?.technicalDetails?.map((_, j) => helperTranslate(d => d.pages.infrastructure.quais.items[i]?.technicalDetails?.[j])) || []
                        }))
                    },
                    interactiveMapTitle: helperTranslate(d => d.pages.infrastructure.interactiveMapTitle),
                    interactiveMapDesc: helperTranslate(d => d.pages.infrastructure.interactiveMapDesc),
                    technicalDetails: helperTranslate(d => d.pages.infrastructure.technicalDetails),
                    strategicZone: helperTranslate(d => d.pages.infrastructure.strategicZone),
                    zones: {
                        title: helperTranslate(d => d.pages.infrastructure.zones.title),
                        items: dictFr.pages.infrastructure.zones.items.map((_, i) => ({
                            name: helperTranslate(d => d.pages.infrastructure.zones.items[i]?.name),
                            area: helperTranslate(d => d.pages.infrastructure.zones.items[i]?.area),
                            purpose: helperTranslate(d => d.pages.infrastructure.zones.items[i]?.purpose)
                        }))
                    }
                }
            }]
        },
        {
            slug: 'services',
            title: helperTranslate(d => d.pages.services.title),
            status: 'published',
            blocks: [{
                type: 'custom_page_data',
                content: {
                    subtitle: helperTranslate(d => d.pages.services.subtitle),
                    list: dictFr.pages.services.list.map((_, i) => ({
                        slug: dictFr.pages.services.list[i].slug,
                        icon: dictFr.pages.services.list[i].icon,
                        title: helperTranslate(d => d.pages.services.list[i]?.title),
                        desc: helperTranslate(d => d.pages.services.list[i]?.desc),
                        points: dictFr.pages.services.list[i].points.map((_, j) => helperTranslate(d => d.pages.services.list[i]?.points[j]))
                    }))
                }
            }]
        }
    ];

    for (const page of pagesData) {
        console.log(`Processing ${page.slug}...`);
        const { data: existing } = await supabase.from('pages').select('id').eq('slug', page.slug).single();
        if (existing) {
            const { error } = await supabase.from('pages').update(page).eq('id', existing.id);
            if(error) console.error(error);
            else console.log(`Updated ${page.slug}`);
        } else {
            const { error } = await supabase.from('pages').insert([page]);
            if(error) console.error(error);
            else console.log(`Inserted ${page.slug}`);
        }
    }
}

seed().catch(console.error);
