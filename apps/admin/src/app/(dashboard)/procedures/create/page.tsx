import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/procedures" initial={{ category: 'procedures' }} />;
}
