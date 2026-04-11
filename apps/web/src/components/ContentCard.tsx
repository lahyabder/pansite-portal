'use client';

import type { Locale, Content } from '@/shared_lib';
import { t, formatDate } from '@/shared_lib';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import Image from 'next/image';

interface ContentCardProps {
    item: Content;
    locale: Locale;
    dict: Dictionary;
}

const categoryColors: Record<string, string> = {
    actualite: 'bg-blue-100 text-blue-700',
    communique: 'bg-purple-100 text-purple-700',
    evenement: 'bg-emerald-100 text-emerald-700',
    alerte: 'bg-amber-100 text-amber-700',
    'le-port': 'bg-pan-sky/20 text-pan-navy',
    infrastructure: 'bg-pan-gold/20 text-pan-navy',
    services: 'bg-pan-blue/20 text-pan-navy',
    procedures: 'bg-pan-navy/20 text-pan-navy',
    tariffs: 'bg-emerald-100 text-emerald-700',
    tenders: 'bg-orange-100 text-orange-700',
};

const categoryRoute: Record<string, string> = {
    actualite: 'actualites',
    communique: 'communiques',
    evenement: 'evenements',
    alerte: 'alertes',
    'le-port': 'actualites', // Generic fallback route for single items
    infrastructure: 'actualites',
    services: 'actualites',
    procedures: 'actualites',
    tariffs: 'actualites',
    tenders: 'actualites',
};

export function ContentCard({ item, locale, dict }: ContentCardProps) {
    const categoryName = dict.content.categories[item.category] || item.category;

    return (
        <Link href={`/${locale}/${categoryRoute[item.category] || 'actualites'}/${item.slug}`} className="block h-full group">
            <article className="bg-white rounded-2xl overflow-hidden border border-pan-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                {/* Card header */}
            <div className="h-44 bg-gradient-to-br from-pan-blue to-pan-sky relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-pan-navy/20 group-hover:bg-pan-navy/10 transition-colors duration-300 z-10" />

                {item.images && item.images.length > 0 ? (
                    item.images[0].startsWith('data:') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.images[0]}
                            alt={t(item.title, locale)}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        />
                    ) : (
                        <Image
                            src={item.images[0]}
                            alt={t(item.title, locale)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-all duration-700"
                        />
                    )
                ) : item.coverImage ? (
                    item.coverImage.startsWith('data:') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.coverImage}
                            alt={t(item.title, locale)}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        />
                    ) : (
                        <Image
                            src={item.coverImage}
                            alt={t(item.title, locale)}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-all duration-700"
                        />
                    )
                ) : (
                    <div className="absolute inset-0 bg-pan-navy/5 flex items-center justify-center text-white/50 text-5xl">
                        📄
                    </div>
                )}
                
                {item.priority === 'urgent' && (
                    <div className="absolute top-3 end-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse z-20">
                        {{ ar: 'عاجل', fr: 'URGENT', en: 'URGENT', es: 'URGENTE' }[locale]}
                    </div>
                )}
                <div className="absolute bottom-3 start-3 flex items-center gap-2 z-20">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-700 shadow-sm border border-white/20 backdrop-blur-md'}`}>
                        {categoryName}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-pan-gray-400 mb-2 flex flex-wrap gap-2 items-center">
                    {item.publishedAt && formatDate(item.publishedAt, locale)}
                    {item.category === 'evenement' && item.eventDate && (
                        <span className="text-emerald-600 font-medium">
                            📅 {formatDate(item.eventDate, locale)}
                        </span>
                    )}
                    {item.category === 'tenders' && item.expiresAt && (
                        <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                            ⏳ {formatDate(item.expiresAt, locale)}
                        </span>
                    )}
                </div>
                <h3 className="text-base font-semibold text-pan-navy mb-2 line-clamp-2 group-hover:text-pan-sky transition-colors duration-300">
                    {t(item.title, locale)}
                </h3>
                <p className="text-pan-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {t(item.excerpt, locale) || t(item.body, locale)}
                </p>
                
                {/* Actions bottom */}
                <div className="mt-auto pt-4 border-t border-pan-gray-50 flex items-center justify-between">
                    <span className="text-pan-sky font-medium text-sm group-hover:text-pan-blue transition-colors inline-flex items-center gap-1">
                        {dict.news.readMore}
                        <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                    </span>
                    
                    {item.externalLink && (
                        <object>
                            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pan-pale text-pan-navy flex items-center justify-center hover:bg-pan-sky hover:text-white transition-colors" title="Download Document" onClick={(e) => e.stopPropagation()}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </a>
                        </object>
                    )}
                </div>
            </div>
            </article>
        </Link>
    );
}
