'use client';

import { useState } from 'react';
import { mockAuditLog } from '@pan/shared';
import type { AuditLogEntry, AuditAction } from '@pan/shared';
import { Search, Activity, Shield, FileText, User as UserIcon, RefreshCw } from 'lucide-react';

// ─── Demo audit entries ───────────────────────────────────────

const DEMO_LOG: AuditLogEntry[] = [
    {
        id: 'al-001',
        entityType: 'session',
        entityId: 'usr-001',
        action: 'login',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Connexion réussie (Super Administrateur)',
        ipAddress: '41.222.33.12',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
        id: 'al-002',
        entityType: 'content',
        entityId: 'cnt-123',
        action: 'publish',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Publication de l\'article: Inauguration des nouveaux quais',
        previousStatus: 'pending',
        newStatus: 'published',
        ipAddress: '41.222.33.12',
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
        id: 'al-003',
        entityType: 'content',
        entityId: 'cnt-124',
        action: 'create',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Création d\'un nouvel appel d\'offres: Fourniture de matériel de manutention',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'al-004',
        entityType: 'content',
        entityId: 'cnt-122',
        action: 'update',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Mise à jour de la page: Présentation du port',
        previousStatus: 'published',
        newStatus: 'published',
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
        id: 'al-005',
        entityType: 'session',
        entityId: 'unknown@hacker.io',
        action: 'failed_login',
        userId: 'unknown@hacker.io',
        userName: 'Inconnu',
        details: 'Tentative échouée pour: unknown@hacker.io',
        ipAddress: '92.184.102.30',
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
        id: 'al-006',
        entityType: 'content',
        entityId: 'cnt-120',
        action: 'archive',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Archivage de l\'article: Communiqué du 10 janvier 2025',
        previousStatus: 'published',
        newStatus: 'archived',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
        id: 'al-007',
        entityType: 'content',
        entityId: 'cnt-119',
        action: 'delete',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Suppression du brouillon: Note interne (non publiée)',
        createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    },
    {
        id: 'al-008',
        entityType: 'session',
        entityId: 'usr-001',
        action: 'logout',
        userId: 'usr-001',
        userName: 'Administrateur PAN',
        details: 'Déconnexion',
        ipAddress: '41.222.33.12',
        createdAt: new Date(Date.now() - 2 * 24 * 3600000 + 3600000).toISOString(),
    },
];

const ALL_LOG = [...DEMO_LOG, ...mockAuditLog];

const actionConfig: Partial<Record<AuditAction, { label: string; bg: string; text: string; icon: React.ReactNode }>> = {
    login:            { label: 'Connexion',         bg: 'bg-green-100',  text: 'text-green-700',  icon: <UserIcon className="w-3.5 h-3.5" /> },
    logout:           { label: 'Déconnexion',       bg: 'bg-gray-100',   text: 'text-gray-600',   icon: <UserIcon className="w-3.5 h-3.5" /> },
    failed_login:     { label: 'Échec connexion',   bg: 'bg-red-100',    text: 'text-red-700',    icon: <Shield className="w-3.5 h-3.5" /> },
    permission_denied:{ label: 'Accès refusé',      bg: 'bg-red-100',    text: 'text-red-700',    icon: <Shield className="w-3.5 h-3.5" /> },
    create:           { label: 'Création',          bg: 'bg-blue-100',   text: 'text-blue-700',   icon: <FileText className="w-3.5 h-3.5" /> },
    update:           { label: 'Modification',      bg: 'bg-amber-100',  text: 'text-amber-700',  icon: <FileText className="w-3.5 h-3.5" /> },
    delete:           { label: 'Suppression',       bg: 'bg-red-100',    text: 'text-red-700',    icon: <FileText className="w-3.5 h-3.5" /> },
    publish:          { label: 'Publication',       bg: 'bg-emerald-100','text': 'text-emerald-700', icon: <Activity className="w-3.5 h-3.5" /> },
    archive:          { label: 'Archivage',         bg: 'bg-purple-100', text: 'text-purple-700', icon: <FileText className="w-3.5 h-3.5" /> },
    approve:          { label: 'Validation',        bg: 'bg-teal-100',   text: 'text-teal-700',   icon: <Activity className="w-3.5 h-3.5" /> },
    role_change:      { label: 'Changement rôle',  bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Shield className="w-3.5 h-3.5" /> },
};

const entityTypeLabels: Record<string, string> = {
    content: 'Contenu',
    session: 'Session',
    user:    'Utilisateur',
    request: 'Demande',
    service: 'Service',
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}

export default function ActivityLogPage() {
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [entityFilter, setEntityFilter] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filtered = ALL_LOG.filter(entry => {
        const matchSearch = !search ||
            entry.userName.toLowerCase().includes(search.toLowerCase()) ||
            (entry.details || '').toLowerCase().includes(search.toLowerCase()) ||
            (entry.ipAddress || '').includes(search);
        const matchAction = !actionFilter || entry.action === actionFilter;
        const matchEntity = !entityFilter || entry.entityType === entityFilter;
        return matchSearch && matchAction && matchEntity;
    });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Journal d&apos;activité</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">
                        {filtered.length} événement(s) enregistré(s)
                    </p>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Connexions', count: ALL_LOG.filter(l => l.action === 'login').length, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Publications', count: ALL_LOG.filter(l => l.action === 'publish').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Modifications', count: ALL_LOG.filter(l => l.action === 'update' || l.action === 'create').length, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Alertes sécurité', count: ALL_LOG.filter(l => l.action === 'failed_login' || l.action === 'permission_denied').length, color: 'text-red-600', bg: 'bg-red-50' },
                ].map(item => (
                    <div key={item.label} className={`${item.bg} rounded-2xl p-4 border border-transparent`}>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                        <p className="text-xs text-pan-gray-500 mt-1">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par utilisateur, action ou IP..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>
                <select
                    value={actionFilter}
                    onChange={e => { setActionFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pan-sky/20"
                >
                    <option value="">Toutes les actions</option>
                    {(Object.keys(actionConfig) as AuditAction[]).map(a => (
                        <option key={a} value={a}>{actionConfig[a]?.label}</option>
                    ))}
                </select>
                <select
                    value={entityFilter}
                    onChange={e => { setEntityFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-pan-sky/20"
                >
                    <option value="">Tous les types</option>
                    {Object.entries(entityTypeLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <button
                    onClick={() => { setSearch(''); setActionFilter(''); setEntityFilter(''); setPage(1); }}
                    className="p-2.5 border border-pan-gray-200 rounded-xl text-pan-gray-500 hover:text-pan-navy hover:border-pan-navy transition-all"
                    title="Réinitialiser"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Log table */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-pan-gray-50">
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Date & heure</th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Action</th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Entité</th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Détails</th>
                                <th className="px-5 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pan-gray-50">
                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-pan-gray-400">
                                        <div className="text-3xl mb-2">📋</div>
                                        <p className="font-medium">Aucun événement trouvé</p>
                                    </td>
                                </tr>
                            )}
                            {paged.map(entry => {
                                const ac = actionConfig[entry.action] || { label: entry.action, bg: 'bg-gray-100', text: 'text-gray-600', icon: <Activity className="w-3.5 h-3.5" /> };
                                const isAlert = entry.action === 'failed_login' || entry.action === 'permission_denied';
                                return (
                                    <tr key={entry.id} className={`hover:bg-pan-gray-50/50 transition-colors ${isAlert ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-5 py-3.5 text-xs text-pan-gray-500 whitespace-nowrap font-mono">
                                            {formatDate(entry.createdAt)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-semibold text-pan-navy">{entry.userName}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${ac.bg} ${ac.text}`}>
                                                {ac.icon}{ac.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs text-pan-gray-500 bg-pan-gray-100 px-2 py-0.5 rounded-full">
                                                {entityTypeLabels[entry.entityType] || entry.entityType}
                                            </span>
                                            {(entry.previousStatus && entry.newStatus) && (
                                                <span className="text-[10px] text-pan-gray-400 ml-2">
                                                    {entry.previousStatus} → {entry.newStatus}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-pan-gray-600 max-w-xs truncate">
                                            {entry.details || '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-pan-gray-400 font-mono">
                                            {entry.ipAddress || '—'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-pan-gray-500">Page {page} sur {totalPages}</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 text-sm font-medium bg-white border border-pan-gray-200 rounded-xl text-pan-gray-600 hover:border-pan-sky hover:text-pan-sky disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            ← Précédent
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
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