import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/berthing" initial={{ category: 'le-port' }} />;
}
