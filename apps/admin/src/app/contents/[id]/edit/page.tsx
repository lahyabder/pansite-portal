import ContentEditor from '@/components/content/ContentEditor';
import { getContentById, updateContent } from '@pan/shared';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contentResp = await getContentById(id);

  if (!contentResp) {
    notFound();
  }

  const handleSave = async (data: any) => {
    'use server';
    await updateContent(id, data, 'usr-001');
    revalidatePath('/contents');
  };

  return <ContentEditor initialData={contentResp} id={id} onSave={handleSave} />;
}
