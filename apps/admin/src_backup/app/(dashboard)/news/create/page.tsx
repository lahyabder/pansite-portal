import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/news" initial={{ category: 'actualite' }} />;
}
