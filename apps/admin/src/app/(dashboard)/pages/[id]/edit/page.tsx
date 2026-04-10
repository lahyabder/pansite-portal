import PageEditor from '@/components/PageEditor';
import { getSupabaseAdmin } from '@pan/shared';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("CRITICAL: Missing Supabase Environment Variables in Admin App.");
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold text-red-600">Configuration Error</h1>
                <p className="mt-2 text-gray-600">Les clés Supabase sont manquantes dans les paramètres Vercel de l'application Admin.</p>
            </div>
        );
    }

    const { data: page, error } = await getSupabaseAdmin()
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !page) {
        console.error("PAGE EDIT FETCH ERROR:", error, "ID:", id);
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
