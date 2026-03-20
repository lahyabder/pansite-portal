'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, ExternalLink, Trash2, Edit3, PlusCircle } from 'lucide-react';

import type { Content, ContentCategory, ContentStatus, LocalizedString } from '@pan/shared';
import { getAllContentsAction, deleteContentAction } from '../../actions';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';

export default function AdminContentsPage() {
    const { session, can } = useAuth();
    const { t, locale } = useI18n();

    const categoryConfig: Record<ContentCategory, { label: string; icon: string }> = {
        actualite: { label: t.contentManagement.categories.actualite, icon: '📰' },
        communique: { label: t.contentManagement.categories.communique, icon: '📢' },
        evenement: { label: t.contentManagement.categories.evenement, icon: '📅' },
        alerte: { label: t.contentManagement.categories.alerte, icon: '⚠️' },
        'le-port': { label: t.contentManagement.categories['le-port'], icon: '⚓' },
        infrastructure: { label: t.contentManagement.categories.infrastructure, icon: '🏗️' },
        services: { label: t.contentManagement.categories.services, icon: '🛠️' },
        procedures: { label: t.contentManagement.categories.procedures, icon: '📜' },
        tariffs: { label: t.contentManagement.categories.tariffs, icon: '💰' },
        stopovers: { label: t.contentManagement.categories.stopovers, icon: '🚢' },
        tenders: { label: t.contentManagement.categories.tenders, icon: '📝' },
        media: { label: t.contentManagement.categories.media, icon: '🖼️' },
        contact: { label: t.contentManagement.categories.contact, icon: '📞' },
    };

    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get('category') || '') as ContentCategory | '';

    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<ContentCategory | ''>(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFilterCategory(initialCategory || '');
        refresh();
    }, [initialCategory]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAllContentsAction();
            if (result.error || !result.data) {
                setError(result.error || 'No data');
                setContents([]);
            } else {
                setContents(Array.isArray(result.data) ? result.data : (result.data.items || []));
            }
        } catch (err: any) {
            console.error('Failed to fetch contents:', err);
            setError(err.message || 'FETCH_EXCEPTION');
            setContents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!session || !can('content', 'delete')) return;
        if (window.confirm(t.contentManagement.messages.confirmDelete)) {
            await deleteContentAction(id, session.user.id);
            showToast(t.contentManagement.messages.deleted);
            refresh();
        }
    };

    const getT = (text: LocalizedString) => text[locale] || text.fr || '';

    const filtered = contents.filter((c) => {
        if (filterCategory && c.category !== filterCategory) return false;
        const title = getT(c.title).toLowerCase();
        if (searchQuery && !title.includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <RequirePermission module="content">
            <div className="space-y-6">
                {/* Toast */}
                {toast && (
                    <div className="fixed top-4 end-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in">
                        ✓ {toast}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-admin-border">
                    <div>
                        <div className="flex items-center gap-3 text-admin-text-muted text-xs font-bold uppercase tracking-[0.2em] mb-2">
                            <Newspaper className="w-4 h-4" />
                            {filterCategory ? categoryConfig[filterCategory as ContentCategory]?.label : t.topbar.titles.contents}
                        </div>
                        <h2 className="text-3xl font-bold text-admin-text italic">
                            {filterCategory 
                                ? `${categoryConfig[filterCategory as ContentCategory]?.label}`
                                : t.topbar.titles.contents}
                        </h2>
                        <p className="text-admin-text-muted text-sm mt-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-pan-gold rounded-full animate-pulse" />
                            {filtered.length} éléments en ligne
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {can('content', 'create') && (
                            <Link
                                href={`/cms/contents/create${filterCategory ? `?category=${filterCategory}` : ''}`}
                                className="px-6 py-3 bg-pan-gold text-pan-navy text-sm font-bold rounded-2xl hover:scale-105 hover:shadow-lg hover:shadow-pan-gold/20 transition-all flex items-center gap-2 group"
                            >
                                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                {t.topbar.titles.newContent}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Simplest Search Filter */}
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder={`${t.common.search}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-3 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    />
                    {!filterCategory && (
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as ContentCategory | '')}
                            className="px-4 py-3 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                        >
                            <option value="">Tous les types</option>
                            {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                                <option key={key} value={key}>{icon} {label}</option>
                            ))}
                        </select>
                    )}
                </div>

                {error && (
                    <div className="flex items-center justify-center p-20 bg-admin-surface rounded-xl border border-admin-danger/30 text-admin-danger">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <span className="text-4xl">⚠️</span>
                            <div>
                                <p className="font-bold">Erreur de chargement</p>
                                <p className="text-sm opacity-70 mt-1">{error}</p>
                            </div>
                            <button onClick={refresh} className="px-4 py-2 bg-admin-primary text-white rounded-lg text-sm font-bold">Réessayer</button>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-10 h-10 border-4 border-pan-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 bg-admin-surface/50 rounded-2xl border border-admin-border border-dashed text-center">
                        <div className="w-16 h-16 bg-admin-surface-alt rounded-full flex items-center justify-center mb-4 text-3xl">
                            {filterCategory ? categoryConfig[filterCategory].icon : '📭'}
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">Aucun contenu trouvé</h3>
                        <p className="text-admin-text-muted text-sm max-w-sm">Prêt à publier quelque chose de nouveau ? Cliquez sur le bouton "Nouveau contenu" en haut à droite pour commencer.</p>
                    </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((content) => {
                            const cat = categoryConfig[content.category];
                            const date = new Date(content.publishedAt || content.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
                            
                            return (
                                <div key={content.id} className="bg-admin-surface rounded-2xl border border-admin-border overflow-hidden hover:border-admin-primary/50 transition-all flex flex-col group shadow-lg shadow-black/20">
                                    {/* Cover Image */}
                                    <div className="h-44 bg-admin-surface-alt relative flex items-center justify-center border-b border-admin-border overflow-hidden">
                                        {content.coverImage || content.images?.[0] ? (
                                            <img 
                                                src={content.coverImage || content.images?.[0]} 
                                                alt={getT(content.title)} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="text-6xl opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500">
                                                {cat.icon}
                                            </div>
                                        )}
                                        {/* Category Badge showing on top left */}
                                        {!filterCategory && (
                                            <div className="absolute top-3 left-3 px-2 py-1.5 bg-black/70 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-xs font-bold text-white border border-white/10 shadow-lg">
                                                <span>{cat.icon}</span>
                                                {cat.label}
                                            </div>
                                        )}
                                        {/* Priority Badge */}
                                        {['important', 'urgent'].includes(content.priority || '') && (
                                            <div className={`absolute top-3 right-3 px-2 py-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-white shadow-lg ${content.priority === 'urgent' ? 'bg-red-500' : 'bg-amber-500'}`}>
                                                {content.priority === 'urgent' ? '🚨 URGENT' : '⚡ IMPORTANT'}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Content Info */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-2 group-hover:text-pan-gold transition-colors">
                                            {getT(content.title)}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-admin-text-muted text-[11px] mb-5">
                                            <span>📅 {date}</span>
                                            {content.status === 'published' && (
                                                <a
                                                    href={`http://localhost:3000/${locale}/actualites/${content.slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1 text-pan-gold hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Voir sur le site
                                                </a>
                                            )}
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="mt-auto pt-4 flex items-center gap-2 border-t border-admin-border/50">
                                            {can('content', 'edit') && (
                                                <Link 
                                                    href={`/cms/contents/${content.id}/edit`} 
                                                    className="flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl bg-pan-gold/10 text-pan-gold hover:bg-pan-gold hover:text-pan-navy font-bold text-xs transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    Modifier
                                                </Link>
                                            )}
                                            {can('content', 'delete') && (
                                                <button 
                                                    onClick={() => handleDelete(content.id)} 
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </RequirePermission>
    );
}

