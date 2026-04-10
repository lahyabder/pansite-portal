import PageEditor from '@/components/PageEditor';
import { getSupabaseAdmin } from '@pan/shared';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;

    const { data: page, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !page) {
        notFound();
    }

    // Map DB row to our Page type (CamelCase)
    const initialData = {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        status: page.status,
        blocks: page.blocks,
        seo: page.seo,
        hero: page.hero
    };

    return <PageEditor initialData={initialData} id={id} />;
}
