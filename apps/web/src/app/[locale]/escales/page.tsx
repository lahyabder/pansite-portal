import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function EscalesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: {
            vesselName: 'اسم السفينة',
            type: 'النوع',
            date: 'التاريخ',
            status: 'الحالة',
            download: 'تحميل جدول الرسو الأسبوعي (PDF)'
        },
        fr: {
            vesselName: 'Nom du Navire',
            type: 'Type',
            date: 'Date',
            status: 'Statut',
            download: 'Télécharger le planning (PDF)'
        },
        en: {
            vesselName: 'Vessel Name',
            type: 'Type',
            date: 'Date',
            status: 'Status',
            download: 'Download Weekly Berthing Schedule (PDF)'
        },
        es: {
            vesselName: 'Nombre del Buque',
            type: 'Tipo',
            date: 'Fecha',
            status: 'Estado',
            download: 'Descargar Programa de Atraque Semanal (PDF)'
        }
    }[locale];

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

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-pan-navy mb-4">{dict.pages.stopovers.recent.title}</h2>
                        <div className="h-1 w-20 bg-pan-gold rounded-full" />
                    </div>

                    <div className="overflow-x-auto rounded-3xl border border-pan-navy/5 shadow-xl shadow-pan-navy/5">
                        <table className="w-full text-start">
                            <thead className="bg-pan-pale border-b border-pan-navy/5">
                                <tr>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.vesselName}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.type}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.date}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{labels.status}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pan-navy/5">
                                {dict.pages.stopovers.recent.items.map((item, i) => (
                                    <tr key={i} className="hover:bg-pan-pale/30 transition-colors">
                                        <td className="px-8 py-6 font-bold text-pan-navy">{item.name}</td>
                                        <td className="px-8 py-6 text-pan-gray-600">{item.type}</td>
                                        <td className="px-8 py-6 text-pan-gray-600">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{item.date}</span>
                                                <span className="text-xs text-pan-gray-400">{item.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${['À quai', 'في الرصيف', 'At berth', 'En muelle'].includes(item.status)
                                                ? 'bg-pan-sky/10 text-pan-sky'
                                                : ['En attente', 'في الانتظار', 'Waiting', 'En espera'].includes(item.status)
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-pan-gray-100 text-pan-gray-600'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
