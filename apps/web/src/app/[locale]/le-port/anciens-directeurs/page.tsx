import type { Locale } from '@pan/shared';
import { getDictionary } from '@/lib/dictionaries';
import { PageHero } from '@/components/PageHero';
import { Briefcase, Calendar, Award } from 'lucide-react';

export default async function AnciensDirecteursPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: lp } = await params;
    const locale = (['ar', 'fr', 'en', 'es'].includes(lp) ? lp : 'fr') as Locale;
    const dict = await getDictionary(locale);

    const translatedTitle = locale === 'ar' ? 'المدراء السابقون' : (locale === 'en' ? 'Former Directors' : (locale === 'es' ? 'Ex Directores' : 'Anciens Directeurs'));
    const translatedSubtitle = locale === 'ar' ? 'رحلة البناء والتطوير عبر أجيال من الإدارة الرشيدة' : (locale === 'en' ? 'A journey of growth through generations of leadership' : (locale === 'es' ? 'Un viaje de crecimiento a través de generaciones de liderazgo' : 'Un voyage de construction et de développement à travers les générations'));

    // Sequence of directors
    const directors = [
        {
            nameAr: 'صو محمد دينا',
            nameFr: 'SOW MOHAMED DEYNA',
            period: '1979',
            isFeu: true,
            image: '/images/hero/hero-1.jpg', // Placeholder, user will replace or the DB will link
        },
        {
            nameAr: 'اسلمو ولد التونسي',
            nameFr: 'ISSELMOU OULD TOUNSY',
            period: '1979 - 1980',
            isFeu: false,
            image: '/images/hero/hero-2.jpg',
        },
        {
            nameAr: 'غي سيداتي',
            nameFr: 'GUEYE SIDATY',
            period: '1980 - 1986',
            isFeu: true,
            image: '/images/hero/hero-3.jpg',
        },
        {
            nameAr: 'عمار ولد أحميده',
            nameFr: 'OUMAR OULD HMEIDE',
            period: '1986 - 1987',
            isFeu: true,
            image: '/images/hero/hero-4.jpg',
        },
        {
            nameAr: 'كوني محمود',
            nameFr: 'KONE MAHMOUD',
            period: '1988 - 1994',
            isFeu: true,
            image: '/images/hero/hero-5.jpg',
        }
    ];

    const getFeuLabel = () => {
        switch (locale) {
            case 'ar': return 'المغفور له بإذن الله';
            case 'en': return 'Late';
            case 'es': return 'Fallecido';
            default: return 'Feu';
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <PageHero
                title={translatedTitle}
                subtitle={translatedSubtitle}
                locale={locale}
                breadcrumbs={[
                    { label: dict.nav.home, href: `/${locale}` },
                    { label: dict.nav.port, href: `/${locale}/le-port` },
                    { label: translatedTitle },
                ]}
            />

            <section className="py-24 -mt-20 relative z-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-pan-navy/5 border border-slate-200/60">
                        <div className="flex flex-col items-center text-center mb-20 animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pan-navy/5 text-pan-navy text-xs font-black uppercase tracking-widest mb-4">
                                <Briefcase className="w-3.5 h-3.5" />
                                {locale === 'ar' ? 'القيادات السابقة' : 'Gouvernance Historique'}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{translatedTitle}</h2>
                            <p className="mt-4 text-slate-500 max-w-2xl text-lg">{translatedSubtitle}</p>
                        </div>

                        {/* Timeline Wrapper */}
                        <div className="relative border-l-4 border-slate-200/80 ml-4 md:ml-1/2 md:border-none md:flex md:flex-col items-center space-y-16">
                            {/* Central Line for Desktop */}
                            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 -translate-x-1/2 rounded-full pointer-events-none"></div>

                            {Object.values(directors).map((director, index) => (
                                <div key={index} className={`relative flex flex-col md:flex-row items-center justify-between w-full group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    
                                    {/* Timeline Node */}
                                    <div className="absolute left-[-1.55rem] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-pan-navy shadow-lg flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-pan-sky">
                                        <div className="w-3 h-3 bg-pan-gold rounded-full group-hover:bg-pan-sky transition-colors"></div>
                                    </div>

                                    {/* Empty Space for Grid alignment */}
                                    <div className="hidden md:block w-5/12"></div>

                                    {/* Card Content */}
                                    <div className={`w-full md:w-5/12 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 lg:pr-16 md:text-right' : 'md:pl-12 lg:pl-16 md:text-left'} text-center md:text-left`}>
                                        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 overflow-hidden relative">
                                            
                                            {/* Decorative Background Glow */}
                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pan-gold/10 blur-3xl rounded-full"></div>
                                            
                                            {/* Photo */}
                                            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                                                <div className="absolute inset-0 bg-pan-navy/5 rounded-full border border-slate-200"></div>
                                                <img 
                                                    src={director.image} 
                                                    alt={locale === 'ar' ? director.nameAr : director.nameFr} 
                                                    className="w-full h-full object-cover rounded-full shadow-inner border-4 border-white"
                                                />
                                                {director.isFeu && (
                                                    <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                                                        <span className="bg-yellow-400 text-slate-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                                                            {getFeuLabel()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className={`flex flex-col ${locale === 'ar' ? 'items-center sm:items-start text-right w-full' : 'items-center sm:items-start text-left w-full'}`}>
                                                <h3 className="text-2xl font-black text-slate-900 mb-1">
                                                    {locale === 'ar' ? director.nameAr : director.nameFr}
                                                </h3>
                                                {(locale !== 'ar' && locale !== 'fr') && (
                                                    <h4 className="text-sm font-bold text-slate-500 mb-2">{director.nameFr}</h4>
                                                )}
                                                
                                                <div className="inline-flex flex-wrap items-center gap-2 mt-4">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pan-navy text-white text-xs font-bold rounded-xl shadow-md">
                                                        <Calendar className="w-3.5 h-3.5 text-pan-gold" />
                                                        <span dir="ltr">{director.period}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200" title="Directeur Général">
                                                        <Award className="w-4 h-4 text-pan-navy" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-center opacity-60">
                            <span className="text-sm font-medium text-slate-500 italic">
                                {locale === 'ar' ? '... ويستمر العطاء' : '... And the legacy continues'}
                            </span>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
