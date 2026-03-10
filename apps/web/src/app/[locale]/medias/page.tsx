import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import Link from 'next/link';

export default async function MediaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    return (
        <>
            <PageHero
                title={dict.pages.media.title}
                subtitle={dict.pages.media.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.media.title },
                ]}
            />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-bold uppercase tracking-wider mb-4">
                            <span className="w-2 h-2 rounded-full bg-pan-gold" />
                            {dict.pages.media.news.title}
                        </div>
                        <h2 className="text-3xl font-bold text-pan-navy">{dict.pages.media.news.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {dict.pages.media.news.items.map((item, i) => (
                            <article key={i} className="group relative bg-pan-pale rounded-3xl overflow-hidden border border-pan-navy/5 hover:border-pan-sky/20 transition-all hover:bg-white hover:shadow-2xl hover:shadow-pan-navy/10 transform hover:-translate-y-2 duration-500">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pan-sky/5 rounded-bl-[100px] -mr-12 -mt-12 group-hover:bg-pan-sky/10 transition-colors" />
                                <div className="p-10 relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-4 py-1.5 rounded-full bg-white text-pan-navy text-xs font-bold shadow-sm">{item.category}</span>
                                        <span className="text-pan-gray-400 text-xs font-bold uppercase tracking-widest">{item.date}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-pan-navy mb-4 group-hover:text-pan-sky transition-colors">{item.title}</h3>
                                    <p className="text-pan-gray-600 mb-8 leading-relaxed font-medium">{item.excerpt}</p>
                                    <Link
                                        href={`/${locale}/medias`}
                                        className="inline-flex items-center gap-2 text-pan-sky font-bold hover:text-pan-navy transition-all group-hover:gap-4"
                                    >
                                        {dict.common.learnMore}
                                        <span aria-hidden="true" className="text-xl">→</span>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-pan-navy text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-pan-sky rounded-full -ml-48 -mt-48" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-pan-gold rounded-full -mr-48 -mb-48" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">{dict.pages.media.gallery.title}</h2>
                    <p className="text-pan-light/60 max-w-2xl mx-auto mb-16 text-lg font-medium leading-relaxed">{dict.pages.media.gallery.desc}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 grayscale hover:grayscale-0 transition-all duration-700">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/10 hover:border-pan-sky/40 transition-all transform hover:scale-105" />
                        ))}
                    </div>

                    <button className="px-10 py-4 bg-pan-gold text-pan-navy font-bold rounded-2xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl shadow-pan-gold/20">
                        {locale === 'ar' ? 'اطلع على معرض الصور بالكامل' : 'Voir tout l\'album photo'}
                    </button>
                </div>
            </section>
        </>
    );
}
