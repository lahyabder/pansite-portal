import { ContentForm } from '@/components/ContentForm';
export default function CreateContentPage() {
    return <ContentForm basePath="/services" initial={{ category: 'services' }} />;
}
