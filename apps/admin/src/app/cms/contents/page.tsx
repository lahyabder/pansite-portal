'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Ship, Globe, ExternalLink, Trash2, Edit3, Eye, PlusCircle } from 'lucide-react';

import {
    getAllContents,
    submitForReview,
    publishContent,
    archiveContent,
    restoreContent,
} from '@pan/shared';
import type { Content, ContentCategory, ContentStatus, LocalizedString } from '@pan/shared';
import { getAllContentsAction, publishContentAction, updateContentAction, deleteContentAction } from '../../actions';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminContentsPage() {
    const { session, can } = useAuth();
    const { t, locale } = useI18n();

    const statusConfig: Record<ContentStatus, { label: string; color: string }> = {
        draft: { label: t.contentManagement.statuses.draft, color: 'bg-gray-500/15 text-gray-400' },
        pending_approval: { label: t.contentManagement.statuses.pending_approval, color: 'bg-amber-500/15 text-amber-400' },
        published: { label: t.contentManagement.statuses.published, color: 'bg-emerald-500/15 text-emerald-400' },
        archived: { label: t.contentManagement.statuses.archived, color: 'bg-red-500/15 text-red-400' },
    };

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
    const initialStatus = (searchParams.get('status') || '') as ContentStatus | '';
    const initialCategory = (searchParams.get('category') || '') as ContentCategory | '';

    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<ContentCategory | ''>(initialCategory);
    const [filterStatus, setFilterStatus] = useState<ContentStatus | ''>(initialStatus);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        setFilterCategory(initialCategory || '');
        setFilterStatus(initialStatus || '');
        refresh();
    }, [initialCategory, initialStatus]);

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

    const handleAction = async (id: string, action: string) => {
        if (!session) return;
        const userId = session.user.id;
        let result;
        switch (action) {
            case 'submit':
                result = await updateContentAction(id, { status: 'pending_approval' }, userId);
                if (result) showToast(t.contentManagement.messages.submitted);
                break;
            case 'publish':
                result = await publishContentAction(id, userId);
                if (result) showToast(t.contentManagement.messages.published);
                break;
            case 'archive':
                result = await updateContentAction(id, { status: 'archived' }, userId);
                if (result) showToast(t.contentManagement.messages.archived);
                break;
            case 'restore':
                result = await updateContentAction(id, { status: 'draft' }, userId);
                if (result) showToast(t.contentManagement.messages.restored);
                break;
            case 'delete':
                if (window.confirm(t.contentManagement.messages.confirmDelete)) {
                    await deleteContentAction(id, userId);
                    showToast(t.contentManagement.messages.deleted);
                }
                break;
        }
        refresh();
    };

    const getT = (text: LocalizedString) => text[locale] || text.fr || '';

    const filtered = contents.filter((c) => {
        if (filterCategory && c.category !== filterCategory) return false;
        if (filterStatus && c.status !== filterStatus) return false;
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
                                ? `Gestion des ${categoryConfig[filterCategory as ContentCategory]?.label}`
                                : t.topbar.titles.contents}
                        </h2>
                        <p className="text-admin-text-muted text-sm mt-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-pan-gold rounded-full animate-pulse" />
                            {filtered.length} documents répertoriés
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

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder={`${t.common.search}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm w-64 focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as ContentCategory | '')}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <option value="">{t.common.filter} ({t.common.status})</option>
                        {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                            <option key={key} value={key}>{icon} {label}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as ContentStatus | '')}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <option value="">{t.common.filter} ({t.common.status})</option>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Status workflow overview */}
                <div className="grid grid-cols-4 gap-3">
                    {(Object.entries(statusConfig) as [ContentStatus, typeof statusConfig[ContentStatus]][]).map(([key, { label, color }]) => {
                        const count = contents.filter((c) => c.status === key).length;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
                                className={`bg-admin-surface rounded-xl p-4 border transition-all ${filterStatus === key ? 'border-admin-primary' : 'border-admin-border hover:border-admin-primary/30'
                                    }`}
                            >
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${color}`}>{label}</span>
                                <div className="text-2xl font-bold text-admin-text mt-2">{count}</div>
                            </button>
                        );
                    })}
                </div>

                {error && (
                    <div className="flex items-center justify-center p-20 bg-admin-surface rounded-xl border border-admin-danger/30 text-admin-danger">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <span className="text-4xl">⚠️</span>
                            <div>
                                <p className="font-bold">Erreur de chargement</p>
                                <p className="text-sm opacity-70 mt-1">Impossible de récupérer les contenus: {error}</p>
                                <p className="text-[10px] opacity-50 mt-2 font-mono">Consultez <Link href="/cms/debug" className="underline text-pan-gold">/cms/debug</Link> pour diagnostiquer la connexion</p>
                            </div>

                            <button onClick={refresh} className="px-4 py-2 bg-admin-primary text-white rounded-lg text-sm font-bold">Réessayer</button>
                        </div>
                    </div>
                )}


                {loading && (
                    <div className="flex items-center justify-center p-20 bg-admin-surface rounded-xl border border-admin-border">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-pan-gold border-t-transparent rounded-full animate-spin" />
                            <p className="text-admin-text-muted text-sm font-medium">Chargement des contenus...</p>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-admin-border">
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.title}</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.type}</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.status}</th>
                                    <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.priority}</th>
                                    <th className="text-end px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">{t.common.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {filtered.map((content) => {
                                    const cat = categoryConfig[content.category];
                                    const status = statusConfig[content.status];
                                    return (
                                        <tr key={content.id} className="hover:bg-admin-surface-alt/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                                                        {cat.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-admin-text text-sm font-bold line-clamp-1">{getT(content.title)}</div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-admin-text-muted text-[10px] uppercase font-mono">{content.id}</span>
                                                            {content.status === 'published' && (
                                                                <a
                                                                    href={`http://localhost:3000/${locale}/actualites/${content.slug}`}
                                                                    target="_blank"
                                                                    className="text-pan-gold hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    Voir en ligne
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-admin-text-muted text-sm">{cat.icon} {cat.label}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {content.priority === 'urgent' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-500/15 text-red-400">🚨 {t.contentManagement.priorities.urgent}</span>
                                                )}
                                                {content.priority === 'important' && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-400">⚡ {t.contentManagement.priorities.important}</span>
                                                )}
                                                {(!content.priority || content.priority === 'normal') && (
                                                    <span className="text-admin-text-muted text-xs">{t.contentManagement.priorities.normal}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-end">
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    {/* Workflow actions */}
                                                    {(content.status === 'draft' && can('content', 'approve')) && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'submit')}
                                                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-pan-navy text-[10px] font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
                                                            title={t.contentManagement.workflow.submit}
                                                        >
                                                            {t.contentManagement.workflow.submit}
                                                        </button>
                                                    )}
                                                    {(content.status === 'draft' && can('content', 'publish')) && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'publish')}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-pan-navy text-[10px] font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                                                            title={t.contentManagement.workflow.publish}
                                                        >
                                                            {t.contentManagement.workflow.publish}
                                                        </button>
                                                    )}
                                                    {(content.status === 'pending_approval' && can('content', 'approve')) && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'publish')}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-pan-navy text-[10px] font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
                                                            title={t.contentManagement.workflow.approve}
                                                        >
                                                            {t.contentManagement.workflow.approve}
                                                        </button>
                                                    )}
                                                    {(content.status === 'published' && can('content', 'edit')) && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'archive')}
                                                            className="px-3 py-1.5 rounded-lg bg-gray-600 text-white text-[10px] font-bold hover:bg-gray-500 transition-all"
                                                            title={t.contentManagement.workflow.archive}
                                                        >
                                                            {t.contentManagement.workflow.archive}
                                                        </button>
                                                    )}
                                                    {(content.status === 'archived' && can('content', 'edit')) && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'restore')}
                                                            className="px-3 py-1.5 rounded-lg bg-sky-500 text-pan-navy text-[10px] font-bold hover:bg-sky-400 transition-all"
                                                            title={t.contentManagement.workflow.restore}
                                                        >
                                                            {t.contentManagement.workflow.restore}
                                                        </button>
                                                    )}
                                                    
                                                    {can('content', 'edit') && (
                                                        <Link
                                                            href={`/cms/contents/${content.id}/edit`}
                                                            className="p-2 rounded-lg bg-white/5 text-white hover:bg-pan-gold hover:text-pan-navy transition-all border border-white/5"
                                                            title={t.common.edit}
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                    
                                                    {can('content', 'delete') && (
                                                        <button
                                                            onClick={() => handleAction(content.id, 'delete')}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                            title={t.common.delete}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}

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
        </RequirePermission>
    );
}
