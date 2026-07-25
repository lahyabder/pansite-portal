import type { Metadata } from 'next';
import type { Locale } from '@/shared_lib';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const { getDictionary } = await import('@/lib/dictionaries');
    const dict = await getDictionary(locale);
    
    const descriptions = {
        fr: "Consultez en temps réel le programme des escales, les navires attendus et les mouvements maritimes actuels au Port Autonome de Nouadhibou (PAN).",
        ar: "اطلع في الوقت الفعلي على برنامج رسو السفن، والسفن المتوقعة، والحركات البحرية الحالية في ميناء نواذيبو المستقل لضمان تتبع دقيق لعملياتك.",
        en: "Check in real-time the stopovers schedule, expected vessels, and current maritime movements at the Autonomous Port of Nouadhibou (PAN).",
        es: "Consulte en tiempo real el programa de escalas, los buques esperados y los movimientos marítimos actuales en el Puerto Autónomo de Nuadibú (PAN)."
    };

    return {
        title: dict.nav.stopovers,
        description: descriptions[locale] || descriptions.fr,
        alternates: {
            canonical: `/${locale}/escales`,
            languages: {
                fr: '/fr/escales',
                ar: '/ar/escales',
                en: '/en/escales',
                es: '/es/escales',
            },
        },
    };
}
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { getPublishedContents, t, formatDate } from '@/shared_lib';
import { AlertCircle, Clock } from 'lucide-react';

export const revalidate = 60;

export default async function EscalesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    const labels = {
        ar: {
            vesselName: 'اسم السفينة',
            type: 'النوع',
            date: 'التاريخ',
            status: 'الحالة',
            download: 'تحميل جدول الرسو الأسبوعي (PDF)',
            empty: 'لا توجد حركات سفن مسجلة حالياً'
        },
        fr: {
            vesselName: 'Nom du Navire',
            type: 'Type',
            date: 'Date',
            status: 'Statut',
            download: 'Télécharger le planning (PDF)',
            empty: 'Aucun mouvement de navire enregistré pour le moment'
        },
        en: {
            vesselName: 'Vessel Name',
            type: 'Type',
            date: 'Date',
            status: 'Status',
            download: 'Download Weekly Berthing Schedule (PDF)',
            empty: 'No ship movements recorded at the moment'
        },
        es: {
            vesselName: 'Nombre del Buque',
            type: 'Tipo',
            date: 'Fecha',
            status: 'Estado',
            download: 'Descargar Programa de Atraque Semanal (PDF)',
            empty: 'No hay movimientos de barcos registrados en este momento'
        }
    }[locale];

    // Fetch dynamic stopovers from database
    const { items: stopovers } = await getPublishedContents({ category: 'stopovers', pageSize: 50 });

    return (
        <>
            <PageHero
                title={dict.pages.stopovers.title}
                subtitle={dict.pages.stopovers.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.nav.services, href: `/${locale}/services` },
                    { label: dict.pages.stopovers.title },
                ]}
            />

            <section className="py-24 bg-white min-h-[400px]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-pan-navy mb-4">{dict.pages.stopovers.recent.title}</h2>
                        <div className="h-1 w-20 bg-pan-gold rounded-full" />
                    </div>

                    {stopovers.length > 0 ? (
                        <div className="overflow-x-auto rounded-3xl border border-pan-navy/5 shadow-xl shadow-pan-navy/5">
                            <table className="w-full text-start">
                                <thead className="bg-pan-pale border-b border-pan-navy/5">
                                    <tr>
                                        <th className="px-8 py-6 text-start font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.vesselName}</th>
                                        <th className="px-8 py-6 text-start font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.type}</th>
                                        <th className="px-8 py-6 text-start font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.date}</th>
                                        <th className="px-8 py-6 text-start font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.status}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pan-navy/5">
                                    {stopovers.map((item) => {
                                        const statusText = t(item.excerpt, locale);
                                        const isBerth = ['À quai', 'في الرصيف', 'At berth', 'En muelle'].some(s => statusText.includes(s));
                                        const isWaiting = ['En attente', 'في الانتظار', 'Waiting', 'En espera'].some(s => statusText.includes(s));
                                        
                                        return (
                                            <tr key={item.id} className="hover:bg-pan-pale/30 transition-colors">
                                                <td className="px-8 py-6 font-bold text-pan-navy">{t(item.title, locale)}</td>
                                                <td className="px-8 py-6 text-pan-gray-600">{item.tags?.[0] || 'Navire'}</td>
                                                <td className="px-8 py-6 text-pan-gray-600">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold">{item.eventDate ? formatDate(item.eventDate, locale) : formatDate(item.createdAt, locale)}</span>
                                                        {item.eventDate && (
                                                            <span className="text-xs text-pan-gray-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(item.eventDate).toLocaleTimeString(locale === 'ar' ? 'ar-MR' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${isBerth
                                                        ? 'bg-pan-sky/10 text-pan-sky'
                                                        : isWaiting
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-pan-gray-100 text-pan-gray-600'
                                                        }`}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-pan-gray-50 rounded-3xl p-12 text-center border border-pan-gray-100">
                             <AlertCircle className="w-12 h-12 text-pan-gray-300 mx-auto mb-4" />
                             <h3 className="text-xl font-bold text-pan-navy mb-2">{labels.empty}</h3>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 bg-pan-pale relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-pan-navy mb-6">{dict.pages.stopovers.planning.title}</h2>
                    <p className="text-pan-gray-600 max-w-2xl mx-auto mb-12 text-lg">{dict.pages.stopovers.planning.desc}</p>
                    <button className="px-10 py-4 bg-pan-navy text-white font-bold rounded-2xl hover:bg-pan-sky transition-all transform hover:-translate-y-1 shadow-xl shadow-pan-navy/20">
                        {labels.download}
                    </button>
                </div>
            </section>
        </>
    );
}

