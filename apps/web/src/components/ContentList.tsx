'use client';

import type { Locale, ContentCategory } from '@pan/shared';
import { t, formatDate, getContentsByCategory } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { useState } from 'react';

interface ContentListProps {
    locale: Locale;
    dict: Dictionary;
    initialCategory?: ContentCategory;
}

const categories: { key: ContentCategory | 'all'; icon: string }[] = [
    { key: 'all', icon: '📋' },
    { key: 'actualite', icon: '📰' },
    { key: 'communique', icon: '📢' },
    { key: 'evenement', icon: '📅' },
    { key: 'alerte', icon: '⚠️' },
];

export function ContentList({ locale, dict, initialCategory }: ContentListProps) {
    const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>(initialCategory || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // Get all published content
    const allPublished = [
        ...getContentsByCategory('actualite'),
        ...getContentsByCategory('communique'),
        ...getContentsByCategory('evenement'),
        ...getContentsByCategory('alerte'),
    ].sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

    const filtered = activeCategory === 'all'
        ? allPublished
        : allPublished.filter((c) => c.category === activeCategory);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const items = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleCategoryChange = (cat: ContentCategory | 'all') => {
        setActiveCategory(cat);
        setCurrentPage(1);
    };

    const categoryColors: Record<string, string> = {
        actualite: 'bg-blue-100 text-blue-700',
        communique: 'bg-purple-100 text-purple-700',
        evenement: 'bg-emerald-100 text-emerald-700',
        alerte: 'bg-amber-100 text-amber-700',
    };

    const categoryRoute: Record<string, string> = {
        actualite: 'actualites',
        communique: 'communiques',
        evenement: 'evenements',
        alerte: 'alertes',
    };

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(({ key, icon }) => (
                    <button
                        key={key}
                        onClick={() => handleCategoryChange(key)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === key
                                ? 'bg-pan-navy text-white shadow-lg shadow-pan-navy/20'
                                : 'bg-white text-pan-gray-500 border border-pan-gray-200 hover:border-pan-sky hover:text-pan-sky'
                            }`}
                    >
                        <span>{icon}</span>
                        {key === 'all' ? dict.content.categories.all : dict.content.categories[key]}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <div className="text-sm text-pan-gray-500 mb-6">
                {dict.content.pagination.showing} <strong>{items.length}</strong> {dict.content.pagination.of} <strong>{filtered.length}</strong> {dict.content.pagination.results}
            </div>

            {/* Items grid */}
            {items.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-pan-gray-100">
                    <div className="text-4xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-pan-navy mb-2">{dict.content.empty.title}</h3>
                    <p className="text-pan-gray-500">{dict.content.empty.description}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-pan-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                        >
                            {/* Card header */}
                            <div className="h-44 bg-gradient-to-br from-pan-blue to-pan-sky relative overflow-hidden">
                                <div className="absolute inset-0 bg-pan-navy/20 group-hover:bg-pan-navy/10 transition-colors duration-300" />
                                {item.priority === 'urgent' && (
                                    <div className="absolute top-3 end-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                                        URGENT
                                    </div>
                                )}
                                <div className="absolute bottom-3 start-3 flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-700'}`}>
                                        {dict.content.categories[item.category]}
                                    </span>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="text-xs text-pan-gray-400 mb-2">
                                    {item.publishedAt && formatDate(item.publishedAt, locale)}
                                    {item.category === 'evenement' && item.eventDate && (
                                        <span className="ms-2 text-emerald-600">
                                            📅 {formatDate(item.eventDate, locale)}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base font-semibold text-pan-navy mb-2 line-clamp-2 group-hover:text-pan-sky transition-colors duration-300">
                                    {t(item.title, locale)}
                                </h3>
                                <p className="text-pan-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                    {t(item.excerpt, locale)}
                                </p>
                                <Link
                                    href={`/${locale}/${categoryRoute[item.category] || 'actualites'}/${item.slug}`}
                                    className="text-pan-sky font-medium text-sm hover:text-pan-blue transition-colors inline-flex items-center gap-1 mt-auto"
                                >
                                    {dict.news.readMore}
                                    <span aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-pan-gray-200 text-pan-gray-500 hover:border-pan-sky hover:text-pan-sky disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        {dict.common.previous}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${p === currentPage
                                    ? 'bg-pan-navy text-white shadow-lg'
                                    : 'bg-white border border-pan-gray-200 text-pan-gray-500 hover:border-pan-sky hover:text-pan-sky'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-pan-gray-200 text-pan-gray-500 hover:border-pan-sky hover:text-pan-sky disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        {dict.common.next}
                    </button>
                </div>
            )}
        </div>
    );
}
