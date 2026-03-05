import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';

export default async function AppelsOffresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

    // Mock Demo Data for 4 tenders
    const tenders = [
        {
            id: 'AO-2025-001',
            title: locale === 'ar'
                ? 'توسعة المحطة البحرية - المرحلة 2'
                : 'Extension du terminal maritime - Phase 2',
            datePub: '2025-10-15',
            dateLim: '2025-11-30',
            docs: ['Cahier des charges', 'Plans techniques'],
            status: 'active'
        },
        {
            id: 'AO-2025-002',
            title: locale === 'ar'
                ? 'توريد وتركيب 4 رافعات جسرية جديدة'
                : 'Fourniture et installation de 4 nouveaux portiques',
            datePub: '2025-09-01',
            dateLim: '2025-10-15',
            docs: ['Dossier completAO'],
            status: 'closed'
        },
        {
            id: 'AO-2025-003',
            title: locale === 'ar'
                ? 'دراسة الأثر البيئي لتجريف قناة الوصول'
                : 'Étude d\'impact environnemental pour le dragage du chenal d\'accès',
            datePub: '2025-11-01',
            dateLim: '2025-12-15',
            docs: ['Termes de référence', 'Annexes environnementales', 'Formulaires'],
            status: 'active'
        },
        {
            id: 'AO-2025-004',
            title: locale === 'ar'
                ? 'صيانة نظام المراقبة الأمنية (CCTV)'
                : 'Maintenance du système de vidéosurveillance (CCTV)',
            datePub: '2025-11-10',
            dateLim: '2025-12-05',
            docs: ['Règlement de consultation', 'Spécifications techniques'],
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
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-pan-navy text-white text-sm">
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {locale === 'ar' ? 'العنوان & المرجع' : 'Titre & Référence'}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {locale === 'ar' ? 'تاريخ النشر' : 'Date publication'}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {locale === 'ar' ? 'الموعد النهائي' : 'Date limite'}
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            {locale === 'ar' ? 'الوثائق' : 'Documents'}
                                        </th>
                                        <th className="px-6 py-4 font-semibold whitespace-nowrap">
                                            {locale === 'ar' ? 'الحالة' : 'Statut'}
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
                                                        {locale === 'ar' ? 'مفتوح' : 'Ouvert'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pan-gray-100 text-pan-gray-600 text-xs font-bold uppercase rounded-full border border-pan-gray-200">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {locale === 'ar' ? 'مغلق' : 'Clôturé'}
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
