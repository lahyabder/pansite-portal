'use client';

import { useState, useEffect } from 'react';
import { getAllPagesAction, deletePageAction } from '@/app/actions';
import { formatDate } from '@pan/shared';
import type { Page } from '@pan/shared';
import { Plus, Search, Trash2, Pencil, Eye, RefreshCw, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PageManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadPages = async () => {
        setLoading(true);
        try {
            const data = await getAllPagesAction();
            setPages(data || []);
        } catch (err) {
            console.error('Failed to load pages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return;
        setDeletingId(id);
        try {
            await deletePageAction(id);
            setPages(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredPages = pages.filter(page => 
        page.title.fr.toLowerCase().includes(searchQuery.toLowerCase()) || 
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Gestion des Pages</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">{pages.length} pages statiques configurables</p>
                </div>
                <Link
                    href="/pages/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-pan-navy text-white rounded-xl font-semibold text-sm hover:bg-pan-blue transition-all shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    Créer une page
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou slug..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>
                <button onClick={loadPages} className="p-2.5 border border-pan-gray-200 rounded-xl text-pan-gray-500 hover:text-pan-navy">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-pan-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Titre & URL</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Blocs</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Dernière Modif.</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pan-gray-50">
                            {loading && pages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-pan-gray-400">Chargement des pages...</td>
                                </tr>
                            ) : filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-pan-gray-400">Aucune page trouvée</td>
                                </tr>
                            ) : (
                                filteredPages.map(page => (
                                    <tr key={page.id} className="hover:bg-pan-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-pan-gray-100 rounded-lg flex items-center justify-center text-pan-gray-400">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-pan-navy">{page.title.fr}</p>
                                                    <p className="text-[11px] text-pan-gray-400 mt-0.5 flex items-center gap-1">
                                                        <Globe className="w-3 h-3" />
                                                        /{page.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {page.status === 'published' ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-pan-gray-500 font-semibold">
                                            {page.blocks?.length || 0} blocs
                                        </td>
                                        <td className="px-6 py-4 text-xs text-pan-gray-400">
                                            {formatDate(page.updatedAt || page.createdAt, 'fr')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/pages/${page.id}/edit`}
                                                    className="p-2 rounded-lg text-pan-sky hover:bg-pan-sky/10 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page.id)}
                                                    disabled={deletingId === page.id}
                                                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
