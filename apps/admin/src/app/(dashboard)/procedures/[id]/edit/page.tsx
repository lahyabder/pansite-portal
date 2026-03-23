import { ContentForm } from '@/components/ContentForm';
import { getContentByIdAction } from '@/app/actions';

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const content = await getContentByIdAction(id);
    return <ContentForm initial={content || undefined} isEdit basePath="/procedures" />;
}
