import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { Camera, Play, Maximize2, ExternalLink } from 'lucide-react';

export default async function MediaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = getDictionary(locale);

    // Mock images for the gallery
    const photoGallery = [
        { id: 1, src: '/images/hero/hero-1.jpg', title: dict.pages.media.news.items[0].title },
        { id: 2, src: '/images/hero/hero-2.jpg', title: dict.pages.media.news.items[1].title },
        { id: 3, src: '/images/hero/hero-3.jpg', title: dict.pages.media.news.items[2].title },
        { id: 4, src: '/images/hero/hero-4.jpg', title: dict.pages.media.news.items[3].title },
        { id: 5, src: '/images/hero/hero-5.jpg', title: dict.pages.infrastructure.gallery.items[0].title },
        { id: 6, src: '/images/hero/hero-6.jpg', title: dict.pages.infrastructure.gallery.items[1].title },
    ];

    return (
        <div className="bg-pan-pale min-h-screen">
            <PageHero
                title={dict.pages.media.title}
                subtitle={dict.pages.media.subtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.pages.media.title },
                ]}
            />

            {/* Photo Gallery Section */}
            <section className="py-24 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-pan-navy/5 border border-white/40">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-black uppercase tracking-widest mb-4">
                                    <Camera className="w-3.5 h-3.5" />
                                    {dict.pages.media.news.title}
                                </div>
                                <h2 className="text-4xl font-bold text-pan-navy tracking-tight">{dict.pages.media.news.title}</h2>
                            </div>
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-pan-gold/20 via-transparent to-transparent hidden md:block" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {photoGallery.map((item, i) => (
                                <div 
                                    key={i} 
                                    className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-pan-navy shadow-lg hover:shadow-2xl transition-all duration-700"
                                >
                                    <img 
                                        src={item.src} 
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    
                                    {/* Glass Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 p-6 rounded-[1.5rem] bg-white/10 backdrop-blur-md border border-white/20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pan-gold hover:text-white transition-colors">
                                                <Maximize2 className="w-3 h-3" />
                                                {locale === 'ar' ? 'تكبير' : 'Agrandir'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button Top Right */}
                                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-500">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Gallery Section */}
            <section className="py-24 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-black uppercase tracking-widest mb-4">
                            <Play className="w-3.5 h-3.5" />
                            {dict.pages.media.gallery.title}
                        </div>
                        <h2 className="text-4xl font-bold text-pan-navy tracking-tight mb-4">{dict.pages.media.gallery.title}</h2>
                        <p className="text-pan-gray-500 max-w-2xl font-medium">{dict.pages.media.gallery.desc}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Featured Video */}
                        <div className="group relative aspect-video rounded-[3rem] overflow-hidden bg-pan-navy shadow-2xl lg:row-span-2">
                             <img 
                                src="/images/hero/hero-5.jpg" 
                                alt="Video Thumbnail"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-pan-gold flex items-center justify-center shadow-2xl shadow-pan-gold/40 group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                                    <Play className="w-10 h-10 text-pan-navy fill-current ml-1" />
                                </div>
                            </div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <span className="px-3 py-1 rounded-full bg-pan-gold text-pan-navy text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Featured Video</span>
                                <h3 className="text-3xl font-bold text-white leading-tight">Le Port Autonome de Nouadhibou : Portail de l’Économie Nationale</h3>
                            </div>
                        </div>

                        {/* Smaller Videos */}
                        {[1, 2].map((i) => (
                            <div key={i} className="group flex gap-6 p-6 rounded-[2.5rem] bg-white border border-pan-navy/5 hover:border-pan-sky/20 hover:shadow-xl transition-all duration-500">
                                <div className="relative w-48 h-32 rounded-2xl overflow-hidden shrink-0 bg-pan-navy">
                                    <img 
                                        src={`/images/hero/hero-${i+2}.jpg`} 
                                        alt="Video Thumbnail"
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center py-2">
                                    <span className="text-[10px] font-black text-pan-gold uppercase tracking-[0.2em] mb-2">Reportage</span>
                                    <h4 className="text-xl font-bold text-pan-navy group-hover:text-pan-sky transition-colors line-clamp-2">
                                        {i === 1 ? 'Modernisation des infrastructures et nouveaux portiques' : 'Le rôle du port dans le développement du secteur de la pêche'}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
