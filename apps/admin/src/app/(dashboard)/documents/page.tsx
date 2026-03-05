'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    getAllGedDocuments,
    getAdminGedDocuments,
    publishGedDocument,
    archiveGedDocument,
    restoreGedDocument,
    deleteGedDocument,
    formatFileSize,
} from '@pan/shared';
import type { GedDocument, DocumentTheme, DocumentStatus, DocumentAccessLevel } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';

const statusLabels: Record<DocumentStatus, string> = {
    draft: 'Brouillon',
    published: 'Publié',
    archived: 'Archivé',
};

const statusColors: Record<DocumentStatus, string> = {
    draft: 'bg-amber-500/15 text-amber-400',
    published: 'bg-emerald-500/15 text-emerald-400',
    archived: 'bg-gray-500/15 text-gray-400',
};

const accessLabels: Record<DocumentAccessLevel, string> = {
    public: '🌐 Public',
    restricted: '🔒 Restreint',
    internal: '🏢 Interne',
};

const accessColors: Record<DocumentAccessLevel, string> = {
    public: 'bg-emerald-500/15 text-emerald-400',
    restricted: 'bg-amber-500/15 text-amber-400',
    internal: 'bg-red-500/15 text-red-400',
};

const themeLabels: Record<DocumentTheme, string> = {
    reglementation: 'Réglementation',
    tarification: 'Tarification',
    securite: 'Sécurité',
    environnement: 'Environnement',
    infrastructure: 'Infrastructure',
    commerce: 'Commerce',
    rh: 'Ressources Humaines',
    finance: 'Finance',
    autre: 'Autre',
};

const fileTypeColors: Record<string, string> = {
    pdf: 'bg-red-500/15 text-red-400',
    doc: 'bg-blue-500/15 text-blue-400',
    docx: 'bg-blue-500/15 text-blue-400',
    xlsx: 'bg-emerald-500/15 text-emerald-400',
    xls: 'bg-emerald-500/15 text-emerald-400',
    ppt: 'bg-orange-500/15 text-orange-400',
    pptx: 'bg-orange-500/15 text-orange-400',
    jpg: 'bg-pink-500/15 text-pink-400',
    png: 'bg-pink-500/15 text-pink-400',
    other: 'bg-gray-500/15 text-gray-400',
};

export default function AdminDocumentsPage() {
    const [search, setSearch] = useState('');
    const [themeFilter, setThemeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [accessFilter, setAccessFilter] = useState('');
    const [toast, setToast] = useState('');
    const [, setTick] = useState(0);
    const { session, can } = useAuth();

    const rerender = () => setTick((t) => t + 1);

    // Counts
    const allDocs = useMemo(() => getAllGedDocuments(), []);
    const draftCount = allDocs.filter((d) => d.status === 'draft').length;
    const publishedCount = allDocs.filter((d) => d.status === 'published').length;
    const archivedCount = allDocs.filter((d) => d.status === 'archived').length;

    const result = useMemo(() => {
        return getAdminGedDocuments({
            search: search || undefined,
            theme: (themeFilter as DocumentTheme) || undefined,
            status: (statusFilter as DocumentStatus) || undefined,
            accessLevel: (accessFilter as DocumentAccessLevel) || undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, themeFilter, statusFilter, accessFilter, toast]);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    function handlePublish(id: string) {
        if (!session) return;
        publishGedDocument(id, session.user.id);
        rerender();
        showToast('Document publié ✓');
    }
    function handleArchive(id: string) {
        if (!session) return;
        archiveGedDocument(id, session.user.id);
        rerender();
        showToast('Document archivé ✓');
    }
    function handleRestore(id: string) {
        if (!session) return;
        restoreGedDocument(id, session.user.id);
        rerender();
        showToast('Document restauré ✓');
    }
    function handleDelete(id: string) {
        if (!session || !confirm('Supprimer ce document ?')) return;
        deleteGedDocument(id, session.user.id);
        rerender();
        showToast('Document supprimé ✓');
    }

    return (
        <RequirePermission module="documents">
            <div className="space-y-6">
                {/* Toast */}
                {toast && (
                    <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-pulse">
                        {toast}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">Gestion des Documents (GED)</h2>
                        <p className="text-admin-text-muted text-sm mt-1">
                            {allDocs.length} document(s) · Versions · Accès · Archivage
                        </p>
                    </div>
                    {can('documents', 'create') && (
                        <Link
                            href="/documents/create"
                            className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors"
                        >
                            + Nouveau document
                        </Link>
                    )}
                </div>

                {/* Status cards */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Brouillon', count: draftCount, color: 'bg-amber-500/15 border-amber-500/30 text-amber-400' },
                        { label: 'Publié', count: publishedCount, color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
                        { label: 'Archivé', count: archivedCount, color: 'bg-gray-500/15 border-gray-500/30 text-gray-400' },
                    ].map((s) => (
                        <div key={s.label} className="bg-admin-surface rounded-xl border border-admin-border p-4 text-center">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${s.color}`}>
                                {s.label}
                            </span>
                            <div className="text-2xl font-bold text-admin-text mt-2">{s.count}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-2 focus:ring-admin-primary/30"
                    />
                    <select
                        value={themeFilter}
                        onChange={(e) => setThemeFilter(e.target.value)}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none"
                    >
                        <option value="">Tous les thèmes</option>
                        {(Object.entries(themeLabels) as [DocumentTheme, string][]).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none"
                    >
                        <option value="">Tous statuts</option>
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                        <option value="archived">Archivé</option>
                    </select>
                    <select
                        value={accessFilter}
                        onChange={(e) => setAccessFilter(e.target.value)}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none"
                    >
                        <option value="">Tous niveaux</option>
                        <option value="public">Public</option>
                        <option value="restricted">Restreint</option>
                        <option value="internal">Interne</option>
                    </select>
                </div>

                {/* Document table */}
                <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-admin-border text-admin-text-muted text-[10px] font-semibold uppercase tracking-wider">
                                <th className="text-start px-5 py-3">Document</th>
                                <th className="text-start px-3 py-3">Type</th>
                                <th className="text-start px-3 py-3">Thème</th>
                                <th className="text-start px-3 py-3">Accès</th>
                                <th className="text-start px-3 py-3">Version</th>
                                <th className="text-start px-3 py-3">Statut</th>
                                <th className="text-end px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.items.map((doc) => (
                                <DocumentRow
                                    key={doc.id}
                                    doc={doc}
                                    onPublish={handlePublish}
                                    onArchive={handleArchive}
                                    onRestore={handleRestore}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                    {result.items.length === 0 && (
                        <div className="text-center py-12 text-admin-text-muted">
                            Aucun document trouvé
                        </div>
                    )}
                </div>
            </div>
        </RequirePermission>
    );
}

function DocumentRow({
    doc,
    onPublish,
    onArchive,
    onRestore,
    onDelete,
}: {
    doc: GedDocument;
    onPublish: (id: string) => void;
    onArchive: (id: string) => void;
    onRestore: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const [showVersions, setShowVersions] = useState(false);
    const { can } = useAuth();
    const ftColor = fileTypeColors[doc.fileType] || fileTypeColors.other;

    return (
        <>
            <tr className="border-b border-admin-border/50 hover:bg-admin-surface-alt/50 transition-colors">
                {/* Document info */}
                <td className="px-5 py-4">
                    <div className="font-medium text-admin-text">{doc.title.fr}</div>
                    <div className="text-admin-text-muted text-xs mt-0.5">
                        {doc.reference && <span className="font-mono">{doc.reference} · </span>}
                        {doc.keywords.slice(0, 3).join(', ')}
                    </div>
                </td>
                {/* File type */}
                <td className="px-3 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ftColor}`}>
                        {doc.fileType}
                    </span>
                </td>
                {/* Theme */}
                <td className="px-3 py-4 text-admin-text-muted text-xs">
                    {themeLabels[doc.theme]}
                </td>
                {/* Access */}
                <td className="px-3 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${accessColors[doc.accessLevel]}`}>
                        {accessLabels[doc.accessLevel]}
                    </span>
                </td>
                {/* Version */}
                <td className="px-3 py-4">
                    <button
                        onClick={() => setShowVersions(!showVersions)}
                        className="text-xs text-admin-primary-light hover:underline"
                    >
                        v{doc.currentVersion} ({doc.versions.length} {doc.versions.length > 1 ? 'versions' : 'version'})
                    </button>
                </td>
                {/* Status */}
                <td className="px-3 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[doc.status]}`}>
                        {statusLabels[doc.status]}
                    </span>
                </td>
                {/* Actions */}
                <td className="px-5 py-4 text-end whitespace-nowrap space-x-1">
                    {(doc.status === 'draft' && can('documents', 'publish')) && (
                        <button onClick={() => onPublish(doc.id)} className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                            Publier
                        </button>
                    )}
                    {(doc.status === 'published' && can('documents', 'edit')) && (
                        <button onClick={() => onArchive(doc.id)} className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-gray-500/15 text-gray-400 hover:bg-gray-500/25 transition-colors">
                            Archiver
                        </button>
                    )}
                    {(doc.status === 'archived' && can('documents', 'edit')) && (
                        <button onClick={() => onRestore(doc.id)} className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-colors">
                            Restaurer
                        </button>
                    )}
                    {can('documents', 'edit') && (
                        <Link
                            href={`/documents/${doc.id}/edit`}
                            className="inline-block px-2.5 py-1 text-[10px] font-medium rounded-lg bg-admin-surface-alt text-admin-text-muted hover:text-admin-text transition-colors"
                        >
                            Modifier
                        </Link>
                    )}
                    {can('documents', 'view') && (
                        <Link
                            href={`/documents/${doc.id}/versions`}
                            className="inline-block px-2.5 py-1 text-[10px] font-medium rounded-lg bg-admin-primary/10 text-admin-primary-light hover:bg-admin-primary/20 transition-colors"
                        >
                            📋 Versions
                        </Link>
                    )}
                    {can('documents', 'delete') && (
                        <button onClick={() => onDelete(doc.id)} className="px-2 py-1 text-[10px] rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                            ✕
                        </button>
                    )}
                </td>
            </tr>
            {/* Version history row */}
            {showVersions && (
                <tr className="bg-admin-surface-alt/30">
                    <td colSpan={7} className="px-5 py-3">
                        <div className="text-[10px] font-semibold text-admin-text-muted uppercase tracking-wider mb-2">
                            Historique des versions
                        </div>
                        <div className="space-y-1.5">
                            {doc.versions.map((ver) => (
                                <div key={ver.id} className="flex items-center gap-4 text-xs bg-admin-surface rounded-lg px-3 py-2 border border-admin-border/50">
                                    <span className="font-mono text-admin-primary-light font-bold">v{ver.versionNumber}</span>
                                    <span className="text-admin-text flex-1">{ver.fileName}</span>
                                    <span className="text-admin-text-muted">{formatFileSize(ver.fileSize)}</span>
                                    <span className="text-admin-text-muted">{ver.uploadedByName}</span>
                                    <span className="text-admin-text-muted">{new Date(ver.createdAt).toLocaleDateString('fr-FR')}</span>
                                    {ver.comment && <span className="text-admin-text-muted italic truncate max-w-[200px]">{ver.comment}</span>}
                                </div>
                            ))}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
