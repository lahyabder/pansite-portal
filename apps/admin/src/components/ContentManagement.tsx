'use client';

import { useState, useEffect, useTransition } from 'react';
import { formatDate } from '@pan/shared';
import type { Content, ContentCategory } from '@pan/shared';
import { getAllContentsAction, deleteContentAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Trash2, Pencil, Eye, Filter, RefreshCw } from 'lucide-react';

const ALL_CATEGORIES: ContentCategory[] = [
    'actualite', 'communique', 'evenement', 'alerte',
    'le-port', 'infrastructure', 'services', 'procedures', 'tariffs', 'tenders', 'media'
];

const categoryLabels: Record<string, string> = {
    actualite: 'Actualité', communique: 'Communiqué', evenement: 'Événement',
    alerte: 'Alerte', 'le-port': 'Le Port', infrastructure: 'Infrastructure',
    services: 'Services', procedures: 'Procédures', tariffs: 'Tarifs',
    tenders: "Appels d'offres", media: 'Médias',
};

const statusConfig: Record<string, { label: string; color: string }> = {
    draft:     { label: 'Brouillon',  color: 'bg-gray-100 text-gray-600 border border-gray-200' },
    pending:   { label: 'En attente', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    published: { label: 'Publié',     color: 'bg-green-50 text-green-700 border border-green-200' },
    archived:  { label: 'Archivé',    color: 'bg-red-50 text-red-600 border border-red-200' },
};

interface FiltersState {
    search: string;
    category: string;
    status: string;
    page: number;
}

export default function ContentManagemement({ category }: { category?: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [contents, setContents] = useState<Content[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filters, setFilters] = useState<FiltersState>({
        search: '',
        category: category || '',
        status: '',
        page: 1,
    });

    const pageSize = 15;

    const loadData = async () => {
        setLoading(true);
        try {
            const params: any = {
                pageSize,
                page: filters.page,
            };
            if (filters.category) params.category = filters.category;
            if (filters.status) params.status = filters.status;
            if (filters.search) params.search = filters.search;

            const result = await getAllContentsAction(params);
            setContents(result?.items || []);
            setTotal(result?.total || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Supprimer « ${title} » ? Cette action est irréversible.`)) return;
        setDeletingId(id);
        try {
            await deleteContentAction(id, 'admin');
            await loadData();
        } catch (e) {
            alert('Erreur lors de la suppression.');
        } finally {
            setDeletingId(null);
        }
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Gestion des Contenus</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">
                        {total} élément(s) au total
                    </p>
                </div>
                <Link
                    href="/news/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-pan-navy text-white rounded-xl font-semibold text-sm hover:bg-pan-blue transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau contenu
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre..."
                        value={filters.search}
                        onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>

                <select
                    value={filters.category}
                    onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky bg-white"
                >
                    <option value="">Toutes catégories</option>
                    {ALL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                    ))}
                </select>

                <select
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky bg-white"
                >
                    <option value="">Tous les statuts</option>
                    <option value="draft">Brouillon</option>
                    <option value="pending">En attente</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                </select>

                <button
                    onClick={loadData}
                    className="p-2.5 border border-pan-gray-200 rounded-xl text-pan-gray-500 hover:text-pan-navy hover:border-pan-navy transition-all"
                    title="Rafraîchir"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-pan-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mr-3" />
                        Chargement...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-pan-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Contenu</th>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Catégorie</th>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Date pub.</th>
                                    <th className="px-5 py-3 text-right text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pan-gray-50">
                                {contents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-pan-gray-400">
                                            <div className="text-3xl mb-2">📭</div>
                                            <p className="font-medium">Aucun contenu trouvé</p>
                                            <p className="text-sm mt-1">Modifiez vos filtres ou créez un nouveau contenu</p>
                                        </td>
                                    </tr>
                                )}
                                {contents.map(item => {
                                    const fr = typeof item.title === 'object' ? (item.title as any).fr : item.title;
                                    const ar = typeof item.title === 'object' ? (item.title as any).ar : '';
                                    const st = statusConfig[item.status] || statusConfig.draft;
                                    const date = item.publishedAt || item.createdAt;
                                    return (
                                        <tr key={item.id} className={`hover:bg-pan-gray-50/50 transition-colors ${deletingId === item.id ? 'opacity-50' : ''}`}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {item.coverImage ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={item.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-pan-gray-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-pan-gray-100 flex items-center justify-center text-pan-gray-400 flex-shrink-0 text-lg">📄</div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-semibold text-pan-navy truncate max-w-xs">{fr || '—'}</p>
                                                        {ar && <p className="text-xs text-pan-gray-400 truncate max-w-xs mt-0.5 font-arabic" dir="rtl">{ar}</p>}
                                                        <p className="text-[10px] text-pan-gray-300 mt-0.5">{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs font-bold text-pan-gray-600 bg-pan-gray-100 px-2.5 py-1 rounded-full">
                                                    {categoryLabels[item.category] || item.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-pan-gray-500">
                                                {date ? formatDate(date, 'fr') : '—'}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/news/${item.id}/edit`}
                                                        className="p-2 rounded-lg text-pan-sky hover:bg-pan-sky/10 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id, fr || item.slug)}
                                                        disabled={deletingId === item.id}
                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-pan-gray-500">
                        Page {filters.page} sur {totalPages} · {total} résultat(s)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={filters.page <= 1}
                            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                            className="px-4 py-2 text-sm font-medium bg-white border border-pan-gray-200 rounded-xl text-pan-gray-600 hover:border-pan-sky hover:text-pan-sky disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Précédent
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = filters.page > 3 ? filters.page - 2 + i : i + 1;
                            if (p > totalPages) return null;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setFilters(f => ({ ...f, page: p }))}
                                    className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${p === filters.page ? 'bg-pan-navy text-white shadow-md' : 'bg-white border border-pan-gray-200 text-pan-gray-600 hover:border-pan-sky hover:text-pan-sky'}`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            disabled={filters.page >= totalPages}
                            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                            className="px-4 py-2 text-sm font-medium bg-white border border-pan-gray-200 rounded-xl text-pan-gray-600 hover:border-pan-sky hover:text-pan-sky disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Suivant →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
