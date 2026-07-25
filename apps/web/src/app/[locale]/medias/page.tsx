import type { Metadata } from 'next';
import type { Locale } from '@/shared_lib';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: localeParam } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(localeParam) ? localeParam : 'fr') as Locale;
    const { getDictionary } = await import('@/lib/dictionaries');
    const dict = await getDictionary(locale);
    
    const descriptions = {
        fr: "Plongez dans la médiathèque du Port Autonome de Nouadhibou. Découvrez nos galeries photos et vidéos illustrant le dynamisme de nos activités portuaires.",
        ar: "تصفح المكتبة الوسائطية لميناء نواذيبو المستقل. اكتشف معارض الصور والفيديو التي تبرز حيوية ونشاط عملياتنا المينائية وتطور بنيتنا التحتية.",
        en: "Dive into the media library of the Autonomous Port of Nouadhibou. Discover our photo and video galleries illustrating the dynamism of our port activities.",
        es: "Sumérjase en la mediateca del Puerto Autónomo de Nuadibú. Descubra nuestras galerías de fotos y videos que ilustran el dinamismo de nuestras actividades."
    };

    return {
        title: dict.nav.media,
        description: descriptions[locale] || descriptions.fr,
        alternates: {
            canonical: `/${locale}/medias`,
            languages: {
                fr: '/fr/medias',
                ar: '/ar/medias',
                en: '/en/medias',
                es: '/es/medias',
            },
        },
    };
}
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { Camera, Play, Maximize2, ExternalLink, ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 0; // ensure fresh data

export default async function MediaPage({ params }: { params: Promise<{ locale: string }> }) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    // Fetch dynamic assets from the Supabase database
    const { data: assets } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

    const allAssets = assets || [];
    const images = allAssets.filter(a => a.type === 'image');
    const videos = allAssets.filter(a => a.type === 'video');

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

            {/* Creative Photo Gallery Section (Masonry Flow) */}
            <section className="py-24 -mt-20 relative z-20">
                <div className="max-w-[90rem] mx-auto px-6">
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-pan-navy/5 border border-white/60">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-black uppercase tracking-widest mb-4">
                                    <Camera className="w-3.5 h-3.5" />
                                    Galerie Principale
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-pan-navy tracking-tight">{dict.pages.media.title}</h2>
                            </div>
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-pan-gold/20 via-transparent to-transparent hidden md:block" />
                        </div>

                        {images.length === 0 ? (
                            <div className="py-32 flex flex-col items-center justify-center text-pan-navy/40">
                                <ImageIcon className="w-20 h-20 mb-6 opacity-20" />
                                <h3 className="text-xl font-bold">La galerie est vide</h3>
                                <p className="mt-2 text-sm font-medium">Bientôt, de magnifiques clichés seront publiés ici.</p>
                            </div>
                        ) : (
                            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                                {images.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="break-inside-avoid group relative rounded-[2rem] overflow-hidden bg-pan-navy shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer"
                                    >
                                        <img 
                                            src={item.url} 
                                            alt={item.filename}
                                            className="w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        
                                        {/* Glass Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none flex flex-col justify-end p-6">
                                            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate">{item.filename.split('.')[0]}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pan-gold hover:text-white transition-colors pointer-events-auto">
                                                        <Maximize2 className="w-3 h-3" />
                                                        {locale === 'ar' ? 'عرض مكبر' : 'Agrandir'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Video Gallery Section */}
            {videos.length > 0 && (
                <section className="py-24 pb-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16 flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-black uppercase tracking-widest mb-4">
                                <Play className="w-3.5 h-3.5" />
                                Bibliothèque Vidéo
                            </div>
                            <h2 className="text-4xl font-black text-pan-navy tracking-tight mb-4">Multimédia Vidéo</h2>
                            <p className="text-pan-gray-500 max-w-2xl font-medium">Plongez au cœur de l'action du port autonome grâce à nos derniers reportages visuels.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.map((video) => (
                                <div key={video.id} className="group relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-slate-800">
                                    <video src={video.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 rounded-full bg-pan-gold/90 backdrop-blur flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                            <Play className="w-6 h-6 text-pan-navy fill-current ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
                                        <h3 className="text-white font-bold text-sm line-clamp-2">{video.filename}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
