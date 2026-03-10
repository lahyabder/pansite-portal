import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    const labels = {
        ar: {
            sendMessage: 'أرسل لنا رسالة',
            name: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            company: 'الشركة',
            subject: 'الموضوع',
            message: 'الرسالة',
            send: 'إرسال',
            contactInfo: 'معلومات الاتصال',
            address: 'العنوان',
            phone: 'الهاتف',
            map: 'خريطة الموقع'
        },
        fr: {
            sendMessage: 'Envoyez-nous un message',
            name: 'Nom complet',
            email: 'Email',
            company: 'Entreprise',
            subject: 'Sujet',
            message: 'Message',
            send: 'Envoyer',
            contactInfo: 'Coordonnées',
            address: 'Adresse',
            phone: 'Téléphone',
            map: 'Carte — Nouadhibou'
        },
        en: {
            sendMessage: 'Send us a message',
            name: 'Full Name',
            email: 'Email',
            company: 'Company',
            subject: 'Subject',
            message: 'Message',
            send: 'Send',
            contactInfo: 'Contact Information',
            address: 'Address',
            phone: 'Phone',
            map: 'Map — Nouadhibou'
        },
        es: {
            sendMessage: 'Envíenos un mensaje',
            name: 'Nombre completo',
            email: 'Correo electrónico',
            company: 'Empresa',
            subject: 'Asunto',
            message: 'Mensaje',
            send: 'Enviar',
            contactInfo: 'Información de contacto',
            address: 'Dirección',
            phone: 'Teléfono',
            map: 'Mapa — Nouadhibou'
        }
    }[locale];

    return (
        <>
            <PageHero
                title={dict.pages.contact.title}
                subtitle={dict.pages.contact.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.contact.title },
                ]}
            />

            <section className="py-16 bg-pan-gray-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid lg:grid-cols-5 gap-10">
                        {/* Contact form */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-8 border border-pan-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-pan-navy mb-6">
                                {labels.sendMessage}
                            </h2>
                            <form className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pan-gray-700 mb-1.5">
                                            {labels.name}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pan-gray-700 mb-1.5">
                                            {labels.email}
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pan-gray-700 mb-1.5">
                                        {labels.company}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pan-gray-700 mb-1.5">
                                        {labels.subject}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pan-gray-700 mb-1.5">
                                        {labels.message}
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-2.5 bg-pan-gray-50 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 bg-pan-sky text-white font-semibold rounded-xl hover:bg-pan-blue transition-colors shadow-md hover:shadow-lg"
                                >
                                    {labels.send}
                                </button>
                            </form>
                        </div>

                        {/* Contact info sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl p-6 border border-pan-gray-100">
                                <h3 className="font-semibold text-pan-navy mb-4 text-sm uppercase tracking-wider">
                                    {labels.contactInfo}
                                </h3>
                                <ul className="space-y-4 text-sm text-pan-gray-600">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-pan-sky shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-pan-navy">{labels.address}</div>
                                            <div className="mt-1">{dict.footer.address}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-pan-sky shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-pan-navy">{labels.phone}</div>
                                            <div className="mt-1">{dict.footer.phone}</div>
                                            <div className="text-pan-gray-400 text-xs">Fax: {dict.footer.fax}</div>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-pan-sky shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                        <div>
                                            <div className="font-medium text-pan-navy">Email</div>
                                            <div className="mt-1">{dict.footer.email}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Map placeholder */}
                            <div className="bg-pan-gray-200 rounded-2xl h-48 flex items-center justify-center">
                                <span className="text-pan-gray-500 text-sm">{labels.map}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
