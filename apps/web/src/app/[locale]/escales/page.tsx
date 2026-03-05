import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function EscalesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (lp === 'ar' ? 'ar' : 'fr') as Locale;
    const dict = getDictionary(locale);

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
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{locale === 'ar' ? 'اسم السفينة' : 'Nom du Navire'}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{locale === 'ar' ? 'النوع' : 'Type'}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th className="px-8 py-6 font-bold text-pan-navy text-sm uppercase tracking-wider">{locale === 'ar' ? 'الحالة' : 'Statut'}</th>
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
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'À quai' || item.status === 'في الرصيف'
                                                    ? 'bg-pan-sky/10 text-pan-sky'
                                                    : item.status === 'En attente' || item.status === 'في الانتظار'
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
                        {locale === 'ar' ? 'تحميل جدول الرسو الأسبوعي (PDF)' : 'Télécharger le planning (PDF)'}
                    </button>
                </div>
            </section>
        </>
    );
}
