import ContentEditor from '@/components/content/ContentEditor';
import { getContentById, updateContent } from '@pan/shared';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { deleteContentAction } from '@/app/actions';

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contentResp = await getContentById(id);

  if (!contentResp) {
    notFound();
  }

  const handleSave = async (data: any) => {
    'use server';
    data.publishedAt = data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString();
    await updateContent(id, data, 'usr-001');
    revalidatePath('/contents');
  };

  const handleDelete = async () => {
    'use server';
    await deleteContentAction(id);
    redirect('/contents');
  };

  return <ContentEditor initialData={contentResp} id={id} onSave={handleSave} onDelete={handleDelete} />;
}
