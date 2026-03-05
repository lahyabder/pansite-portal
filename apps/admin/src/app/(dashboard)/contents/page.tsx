'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    getAllContents,
    deleteContent,
    submitForReview,
    publishContent,
    archiveContent,
    restoreContent,
} from '@pan/shared';
import type { Content, ContentCategory, ContentStatus } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';

const statusConfig: Record<ContentStatus, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-gray-500/15 text-gray-400' },
    pending_approval: { label: 'En révision', color: 'bg-amber-500/15 text-amber-400' },
    published: { label: 'Publié', color: 'bg-emerald-500/15 text-emerald-400' },
    archived: { label: 'Archivé', color: 'bg-red-500/15 text-red-400' },
};

const categoryConfig: Record<ContentCategory, { label: string; icon: string }> = {
    actualite: { label: 'Actualité', icon: '📰' },
    communique: { label: 'Communiqué', icon: '📢' },
    evenement: { label: 'Événement', icon: '📅' },
    alerte: { label: 'Alerte', icon: '⚠️' },
};

export default function AdminContentsPage() {
    const [contents, setContents] = useState<Content[]>(() => getAllContents());
    const [filterCategory, setFilterCategory] = useState<ContentCategory | ''>('');
    const [filterStatus, setFilterStatus] = useState<ContentStatus | ''>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<string | null>(null);
    const { session, can } = useAuth();

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const refresh = () => setContents([...getAllContents()]);

    const handleAction = (id: string, action: string) => {
        if (!session) return;
        const userId = session.user.id;
        let result;
        switch (action) {
            case 'submit':
                result = submitForReview(id, userId);
                if (result) showToast('Soumis pour révision');
                break;
            case 'publish':
                result = publishContent(id, userId);
                if (result) showToast('Publié avec succès');
                break;
            case 'archive':
                result = archiveContent(id, userId);
                if (result) showToast('Archivé');
                break;
            case 'restore':
                result = restoreContent(id, userId);
                if (result) showToast('Restauré en brouillon');
                break;
            case 'delete':
                if (window.confirm('Supprimer ce contenu ?')) {
                    deleteContent(id, userId);
                    showToast('Supprimé');
                }
                break;
        }
        refresh();
    };

    const filtered = contents.filter((c) => {
        if (filterCategory && c.category !== filterCategory) return false;
        if (filterStatus && c.status !== filterStatus) return false;
        if (searchQuery && !c.title.fr.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">Gestion des Contenus</h2>
                        <p className="text-admin-text-muted text-sm mt-1">
                            {filtered.length} contenu(s) · Workflow: brouillon → révision → publication → archivage
                        </p>
                    </div>
                    {can('content', 'create') && (
                        <Link
                            href="/contents/create"
                            className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors"
                        >
                            + Nouveau contenu
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm w-64 focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as ContentCategory | '')}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <option value="">Toutes catégories</option>
                        {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                            <option key={key} value={key}>{icon} {label}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as ContentStatus | '')}
                        className="px-4 py-2 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50"
                    >
                        <option value="">Tous statuts</option>
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

                {/* Table */}
                <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-admin-border">
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Titre</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Type</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="text-start px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Priorité</th>
                                <th className="text-end px-5 py-3.5 text-admin-text-muted text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {filtered.map((content) => {
                                const cat = categoryConfig[content.category];
                                const status = statusConfig[content.status];
                                return (
                                    <tr key={content.id} className="hover:bg-admin-surface-alt/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="text-admin-text text-sm font-medium line-clamp-1">{content.title.fr}</div>
                                            <div className="text-admin-text-muted text-xs mt-0.5">{content.slug}</div>
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
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-500/15 text-red-400">🚨 Urgent</span>
                                            )}
                                            {content.priority === 'important' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-400">⚡ Important</span>
                                            )}
                                            {(!content.priority || content.priority === 'normal') && (
                                                <span className="text-admin-text-muted text-xs">Normal</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-end">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                {/* Workflow actions */}
                                                {(content.status === 'draft' && can('content', 'approve')) && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'submit')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                                                        title="Soumettre pour révision"
                                                    >
                                                        Soumettre
                                                    </button>
                                                )}
                                                {(content.status === 'draft' && can('content', 'publish')) && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'publish')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                        title="Publier directement"
                                                    >
                                                        Publier
                                                    </button>
                                                )}
                                                {(content.status === 'pending_approval' && can('content', 'approve')) && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'publish')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                        title="Approuver et publier"
                                                    >
                                                        Approuver
                                                    </button>
                                                )}
                                                {(content.status === 'published' && can('content', 'edit')) && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'archive')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors"
                                                        title="Archiver"
                                                    >
                                                        Archiver
                                                    </button>
                                                )}
                                                {(content.status === 'archived' && can('content', 'edit')) && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'restore')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                        title="Restaurer"
                                                    >
                                                        Restaurer
                                                    </button>
                                                )}
                                                {can('content', 'edit') && (
                                                    <Link
                                                        href={`/contents/${content.id}/edit`}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-admin-surface-alt text-admin-text-muted hover:text-admin-text transition-colors"
                                                    >
                                                        Modifier
                                                    </Link>
                                                )}
                                                {can('content', 'delete') && (
                                                    <button
                                                        onClick={() => handleAction(content.id, 'delete')}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        ×
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
            </div>
        </RequirePermission>
    );
}
