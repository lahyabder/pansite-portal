import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/tariffs" initial={{ category: 'tariffs' }} />;
}
