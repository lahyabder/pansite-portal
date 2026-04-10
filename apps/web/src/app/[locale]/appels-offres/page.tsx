import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getPublishedContents, t, formatDate } from '@pan/shared';

export const revalidate = 60;

export default async function AppelsOffresPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    const labels = {
        ar: { title: 'العنوان & المرجع', pub: 'تاريخ النشر', lim: 'الموعد النهائي', docs: 'الوثائق', status: 'الحالة', open: 'مفتوح', closed: 'مغلق', empty: 'لا توجد مناقصات نشطة حالياً' },
        fr: { title: 'Titre & Référence', pub: 'Date publication', lim: 'Date limite', docs: 'Documents', status: 'Statut', open: 'Ouvert', closed: 'Clôturé', empty: 'Aucun appel d\'offres actif pour le moment' },
        en: { title: 'Title & Reference', pub: 'Publication Date', lim: 'Deadline', docs: 'Documents', status: 'Status', open: 'Open', closed: 'Closed', empty: 'No active tenders at the moment' },
        es: { title: 'Título y Referencia', pub: 'Fecha de publicación', lim: 'Fecha límite', docs: 'Documentos', status: 'Estado', open: 'Abierto', closed: 'Cerrado', empty: 'No hay licitaciones activas en este momento' },
    }[locale];

    // Fetch dynamic tenders from database
    const { items: tenders } = await getPublishedContents({ category: 'tenders', pageSize: 50 });

    const isExpired = (expiryStr?: string | null) => {
        if (!expiryStr) return false;
        return new Date(expiryStr) < new Date();
    };

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

            <section className="py-20 bg-pan-gray-50 bg-opacity-50 min-h-[400px]">
                <div className="max-w-7xl mx-auto px-6">
                    {tenders.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-start border-collapse">
                                    <thead>
                                        <tr className="bg-pan-navy text-white text-sm">
                                            <th className="px-6 py-4 font-semibold whitespace-nowrap text-start">
                                                {labels.title}
                                            </th>
                                            <th className="px-6 py-4 font-semibold whitespace-nowrap text-start">
                                                {labels.pub}
                                            </th>
                                            <th className="px-6 py-4 font-semibold whitespace-nowrap text-start">
                                                {labels.lim}
                                            </th>
                                            <th className="px-6 py-4 font-semibold text-start">
                                                {labels.docs}
                                            </th>
                                            <th className="px-6 py-4 font-semibold whitespace-nowrap text-start">
                                                {labels.status}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-pan-gray-100">
                                        {tenders.map((tender) => {
                                            const expired = isExpired(tender.expiresAt);
                                            return (
                                                <tr key={tender.id} className="hover:bg-pan-pale transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-pan-navy group-hover:text-pan-blue transition-colors text-[15px] mb-1">
                                                            {t(tender.title, locale)}
                                                        </div>
                                                        <div className="text-xs text-pan-gray-500 font-mono bg-pan-gray-100 inline-flex px-2 py-0.5 rounded">
                                                            {tender.slug}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-pan-gray-600 font-medium whitespace-nowrap">
                                                        {tender.publishedAt ? formatDate(tender.publishedAt, locale) : '-'}
                                                    </td>
                                                    <td className="px-6 py-5 text-sm whitespace-nowrap">
                                                        <div className={`inline-flex items-center gap-1.5 font-bold ${!expired ? 'text-red-600' : 'text-pan-gray-500'}`}>
                                                            <Clock className="w-4 h-4" />
                                                            {tender.expiresAt ? formatDate(tender.expiresAt, locale) : '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-2">
                                                            {tender.externalLink ? (
                                                                <a 
                                                                    href={tender.externalLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-2 text-xs font-semibold text-pan-navy hover:text-pan-sky bg-white border border-pan-gray-200 hover:border-pan-sky rounded px-3 py-1.5 w-fit shadow-sm hover:shadow-md transition-all group/doc"
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 text-pan-sky group-hover/doc:scale-110 transition-transform" />
                                                                    {dict.common.download}
                                                                    <Download className="w-3.5 h-3.5 ms-2 opacity-30 group-hover/doc:opacity-100 group-hover/doc:translate-y-0.5 transition-all" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-pan-gray-400 italic">No document</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        {!expired ? (
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
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-pan-gray-200 shadow-sm">
                            <AlertCircle className="w-12 h-12 text-pan-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-pan-navy mb-2">{labels.empty}</h3>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
