'use client';

import type { Locale, ContentCategory, Content } from '@/shared_lib';
import { t, formatDate } from '@/shared_lib';
import type { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { useState } from 'react';
import { ContentCard } from './ContentCard';

interface ContentListProps {
    locale: Locale;
    dict: Dictionary;
    initialCategory?: ContentCategory;
    initialItems?: Content[];
}

const categories: { key: ContentCategory | 'all'; icon: string }[] = [
    { key: 'all', icon: '📋' },
    { key: 'actualite', icon: '📰' },
    { key: 'communique', icon: '📢' },
    { key: 'evenement', icon: '📅' },
    { key: 'alerte', icon: '⚠️' },
];

export function ContentList({ locale, dict, initialCategory, initialItems }: ContentListProps) {
    const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>(initialCategory || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // Get all published content from props
    const allPublished = initialItems || [];

    const filtered = activeCategory === 'all'
        ? allPublished
        : allPublished.filter((c) => c.category === activeCategory);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const items = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleCategoryChange = (cat: ContentCategory | 'all') => {
        setActiveCategory(cat);
        setCurrentPage(1);
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
                        <ContentCard key={item.id} item={item} locale={locale} dict={dict} />
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
