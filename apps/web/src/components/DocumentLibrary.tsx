'use client';

import { useState, useMemo } from 'react';
import type { Locale, GedDocument, DocumentTheme } from '@pan/shared';
import { t, formatFileSize, formatDate, getPublicDocuments } from '@pan/shared';
import type { Dictionary } from '@/lib/dictionaries';
import { Search, Download, FileText, FileSpreadsheet, FileIcon, Shield, Layers, Calendar, Globe, Tag } from 'lucide-react';

interface DocumentLibraryProps {
    locale: Locale;
    dict: Dictionary;
}

const themeColors: Record<string, string> = {
    reglementation: 'bg-blue-50 text-blue-700 border-blue-200',
    tarification: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    securite: 'bg-red-50 text-red-700 border-red-200',
    environnement: 'bg-green-50 text-green-700 border-green-200',
    infrastructure: 'bg-slate-50 text-slate-700 border-slate-200',
    commerce: 'bg-amber-50 text-amber-700 border-amber-200',
    rh: 'bg-purple-50 text-purple-700 border-purple-200',
    finance: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    autre: 'bg-gray-50 text-gray-700 border-gray-200',
};

const accessIcons: Record<string, string> = {
    public: '🌐',
    restricted: '🔒',
    internal: '🏢',
};

export function DocumentLibrary({ locale, dict }: DocumentLibraryProps) {
    const [search, setSearch] = useState('');
    const [themeFilter, setThemeFilter] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 9;

    const result = useMemo(() => {
        return getPublicDocuments({
            search: search || undefined,
            theme: (themeFilter as DocumentTheme) || undefined,
            page,
            pageSize,
        });
    }, [search, themeFilter, page]);

    const allDocs = useMemo(() => getPublicDocuments({ pageSize: 100 }), []);
    const themeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        allDocs.items.forEach((d) => {
            counts[d.theme] = (counts[d.theme] || 0) + 1;
        });
        return counts;
    }, [allDocs]);

    const handleDownload = (doc: GedDocument) => {
        if (doc.accessLevel !== 'public') {
            alert(
                doc.accessLevel === 'restricted'
                    ? dict.ged.labels.restrictedDesc
                    : dict.ged.labels.internalDesc,
            );
            return;
        }
        const latestVersion = doc.versions[0];
        alert(`${dict.ged.labels.downloadFile}: ${latestVersion.fileName} (${formatFileSize(latestVersion.fileSize)})`);
    };

    const themes: DocumentTheme[] = [
        'reglementation', 'tarification', 'securite', 'environnement',
        'infrastructure', 'commerce', 'rh', 'finance',
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── Filter Sidebar ─── */}
            <aside className="lg:w-1/4 shrink-0 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-pan-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-pan-navy mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-pan-blue" />
                        {dict.ged.searchPlaceholder}
                    </h3>
                    <input
                        type="text"
                        placeholder="..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full px-4 py-3 rounded-xl border border-pan-gray-200 focus:outline-none focus:ring-2 focus:ring-pan-sky/30 focus:border-pan-sky text-sm bg-pan-gray-50 text-pan-navy mb-6"
                    />

                    <h3 className="text-lg font-bold text-pan-navy mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-pan-blue" />
                        {dict.ged.filters.theme}
                    </h3>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => { setThemeFilter(''); setPage(1); }}
                            className={`text-start px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${!themeFilter
                                ? 'bg-pan-blue text-white shadow-md'
                                : 'bg-transparent text-pan-gray-600 hover:bg-pan-gray-50'
                                }`}
                        >
                            {dict.ged.filters.allThemes} <span className="float-end opacity-60">({allDocs.total})</span>
                        </button>
                        {themes.filter(th => themeCounts[th]).map((th) => (
                            <button
                                key={th}
                                onClick={() => { setThemeFilter(th === themeFilter ? '' : th); setPage(1); }}
                                className={`text-start px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${themeFilter === th
                                    ? 'bg-pan-blue text-white shadow-md'
                                    : 'bg-transparent text-pan-gray-600 hover:bg-pan-gray-50'
                                    }`}
                            >
                                {dict.ged.themes[th]} <span className="float-end opacity-60">({themeCounts[th] || 0})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="lg:w-3/4">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-pan-navy">
                        {themeFilter ? dict.ged.themes[themeFilter] : dict.ged.filters.allThemes}
                    </h2>
                    <div className="text-pan-gray-500 text-sm font-medium bg-white px-4 py-2 rounded-lg border border-pan-gray-100 shadow-sm">
                        {result.total} {result.total === 1 ? 'document' : 'documents'}
                    </div>
                </div>

                {result.items.length > 0 ? (
                    <div className="space-y-4">
                        {result.items.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                locale={locale}
                                dict={dict}
                                onDownload={() => handleDownload(doc)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-pan-gray-100">
                        <FileIcon className="w-12 h-12 text-pan-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-pan-navy mb-2">{dict.ged.labels.noDocuments}</h3>
                        <p className="text-pan-gray-500">{dict.ged.labels.noDocumentsDesc}</p>
                    </div>
                )}

                {/* Pagination */}
                {result.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 rounded-lg border border-pan-gray-200 text-sm text-pan-navy hover:bg-pan-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium bg-white shadow-sm"
                        >
                            {dict.common.previous}
                        </button>
                        {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === p
                                    ? 'bg-pan-blue text-white shadow-md'
                                    : 'text-pan-gray-600 bg-white hover:bg-pan-gray-50 border border-pan-gray-200 shadow-sm'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(Math.min(result.totalPages, page + 1))}
                            disabled={page >= result.totalPages}
                            className="px-4 py-2 rounded-lg border border-pan-gray-200 text-sm text-pan-navy hover:bg-pan-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium bg-white shadow-sm"
                        >
                            {dict.common.next}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

function DocumentCard({
    doc,
    locale,
    dict,
    onDownload,
}: {
    doc: GedDocument;
    locale: Locale;
    dict: Dictionary;
    onDownload: () => void;
}) {
    const latestVersion = doc.versions[0];

    // Icon based on filetype
    const getFileIcon = () => {
        if (doc.fileType === 'pdf') return <FileText className="w-8 h-8 text-red-500" />;
        if (doc.fileType === 'xlsx' || doc.fileType === 'xls') return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
        return <FileIcon className="w-8 h-8 text-blue-500" />;
    };

    return (
        <div className="bg-white rounded-xl border border-pan-gray-100 hover:border-pan-blue shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group">
            <div className="w-16 h-16 bg-pan-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-pan-gray-100 group-hover:scale-105 transition-transform duration-300">
                {getFileIcon()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md border font-semibold tracking-wide uppercase ${themeColors[doc.theme]}`}>
                        {dict.ged.themes[doc.theme]}
                    </span>
                    <span className="text-[11px] font-medium text-pan-gray-500 flex items-center gap-1 bg-pan-gray-50 px-2.5 py-1 rounded-md">
                        <Shield className="w-3 h-3" />
                        {dict.ged.accessLevels[doc.accessLevel]}
                    </span>
                    <span className="text-[11px] font-medium text-pan-gray-500 flex items-center gap-1 bg-pan-gray-50 px-2.5 py-1 rounded-md">
                        <Globe className="w-3 h-3" />
                        {dict.ged.languages[doc.language]}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-pan-navy mb-2 line-clamp-1 group-hover:text-pan-blue transition-colors">
                    {t(doc.title, locale)}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-pan-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {doc.fileType.toUpperCase()} - {formatFileSize(latestVersion.fileSize)}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(latestVersion.createdAt, locale)}</span>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {dict.ged.directions[doc.direction]}</span>
                </div>
            </div>

            <div className="flex shrink-0 w-full md:w-auto">
                <button
                    onClick={onDownload}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-pan-navy hover:bg-pan-blue text-white text-sm font-semibold rounded-lg transition-all shadow-md group-hover:shadow-lg"
                >
                    <Download className="w-4 h-4" />
                    {dict.ged.labels.downloadFile}
                </button>
            </div>
        </div>
    );
}
