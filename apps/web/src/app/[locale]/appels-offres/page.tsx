import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';

export default async function AppelsOffresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: { title: 'العنوان & المرجع', pub: 'تاريخ النشر', lim: 'الموعد النهائي', docs: 'الوثائق', status: 'الحالة', open: 'مفتوح', closed: 'مغلق' },
        fr: { title: 'Titre & Référence', pub: 'Date publication', lim: 'Date limite', docs: 'Documents', status: 'Statut', open: 'Ouvert', closed: 'Clôturé' },
        en: { title: 'Title & Reference', pub: 'Publication Date', lim: 'Deadline', docs: 'Documents', status: 'Status', open: 'Open', closed: 'Closed' },
        es: { title: 'Título y Referencia', pub: 'Fecha de publicación', lim: 'Fecha límite', docs: 'Documentos', status: 'Estado', open: 'Abierto', closed: 'Cerrado' },
    }[locale];

    // Mock Demo Data for 4 tenders
    const tenders = [
        {
            id: 'AO-2025-001',
            title: {
                ar: 'توسعة المحطة البحرية - المرحلة 2',
                fr: 'Extension du terminal maritime - Phase 2',
                en: 'Marine Terminal Extension - Phase 2',
                es: 'Extensión de la terminal marítima - Fase 2'
            }[locale] || 'Extension du terminal maritime - Phase 2',
            datePub: '2025-10-15',
            dateLim: '2025-11-30',
            docs: {
                ar: ['دفتر الشروط', 'المخططات التقنية'],
                fr: ['Cahier des charges', 'Plans techniques'],
                en: ['Specifications', 'Technical plans'],
                es: ['Pliego de condiciones', 'Planos técnicos']
            }[locale] || ['Cahier des charges', 'Plans techniques'],
            status: 'active'
        },
        {
            id: 'AO-2025-002',
            title: {
                ar: 'توريد وتركيب 4 رافعات جسرية جديدة',
                fr: 'Fourniture et installation de 4 nouveaux portiques',
                en: 'Supply and installation of 4 new portal cranes',
                es: 'Suministro e instalación de 4 nuevas grúas pórtico'
            }[locale] || 'Fourniture et installation de 4 nouveaux portiques',
            datePub: '2025-09-01',
            dateLim: '2025-10-15',
            docs: {
                ar: ['ملف المناقصة'],
                fr: ['Dossier complet AO'],
                en: ['Full tender file'],
                es: ['Expediente completo de licitación']
            }[locale] || ['Dossier complet AO'],
            status: 'closed'
        },
        {
            id: 'AO-2025-003',
            title: {
                ar: 'دراسة الأثر البيئي لتجريف قناة الوصول',
                fr: 'Étude d\'impact environnemental pour le dragage du chenal d\'accès',
                en: 'Environmental impact study for access channel dredging',
                es: 'Estudio de impacto ambiental para el dragado del canal de acceso'
            }[locale] || 'Étude d\'impact environnemental pour le dragage du chenal d\'accès',
            datePub: '2025-11-01',
            dateLim: '2025-12-15',
            docs: {
                ar: ['شروط المرجعية', 'الملاحق البيئية', 'نماذج الاستمارة'],
                fr: ['Termes de référence', 'Annexes environnementales', 'Formulaires'],
                en: ['Terms of reference', 'Environmental annexes', 'Forms'],
                es: ['Términos de referencia', 'Anexos ambientales', 'Formularios']
            }[locale] || ['Termes de référence', 'Annexes environnementales', 'Formulaires'],
            status: 'active'
        },
        {
            id: 'AO-2025-004',
            title: {
                ar: 'صيانة نظام المراقبة الأمنية (CCTV)',
                fr: 'Maintenance du système de vidéosurveillance (CCTV)',
                en: 'Maintenance of surveillance system (CCTV)',
                es: 'Mantenimiento del sistema de videovigilancia (CCTV)'
            }[locale] || 'Maintenance du système de vidéosurveillance (CCTV)',
            datePub: '2025-11-10',
            dateLim: '2025-12-05',
            docs: {
                ar: ['نظام الاستشارة', 'المواصفات التقنية'],
                fr: ['Règlement de consultation', 'Spécifications techniques'],
                en: ['Consultation rules', 'Technical specifications'],
                es: ['Reglamento de consulta', 'Especificaciones técnicas']
            }[locale] || ['Règlement de consultation', 'Spécifications techniques'],
            status: 'active'
        }
    ];

    return (
        <>
            <PageHero
                title={dict.pages.tenders.title}
                subtitle={dict.pages.tenders.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.tenders.title },
                ]}
            />

            <section className="py-20 bg-pan-gray-50 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-start border-collapse">
                                <thead>
                                    <tr className="bg-pan-navy text-white text-sm">
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {labels.title}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {labels.pub}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {labels.lim}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {labels.docs}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {labels.status}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pan-gray-100">
                                    {tenders.map((tender) => (
                                        <tr key={tender.id} className="hover:bg-pan-pale transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-pan-navy group-hover:text-pan-blue transition-colors text-[15px] mb-1">
                                                    {tender.title}
                                                </div>
                                                <div className="text-xs text-pan-gray-500 font-mono bg-pan-gray-100 inline-flex px-2 py-0.5 rounded">
                                                    {tender.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-pan-gray-600 font-medium">
                                                {tender.datePub}
                                            </td>
                                            <td className="px-6 py-5 text-sm">
                                                <div className={`inline-flex items-center gap-1.5 font-bold ${tender.status === 'active' ? 'text-red-600' : 'text-pan-gray-500'}`}>
                                                    <Clock className="w-4 h-4" />
                                                    {tender.dateLim}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2">
                                                    {tender.docs.map((d, i) => (
                                                        <button key={i} className="inline-flex items-center gap-2 text-xs font-semibold text-pan-navy hover:text-pan-blue bg-white border border-pan-gray-200 hover:border-pan-blue rounded px-3 py-1.5 w-fit shadow-sm hover:shadow transition-all">
                                                            <FileText className="w-3.5 h-3.5 text-pan-sky" />
                                                            {d}
                                                            <Download className="w-3.5 h-3.5 ms-2 opacity-50" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {tender.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                        {labels.open}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pan-gray-100 text-pan-gray-600 text-xs font-bold uppercase rounded-full border border-pan-gray-200">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {labels.closed}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
