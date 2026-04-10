import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/tenders" initial={{ category: 'tenders' }} />;
}
