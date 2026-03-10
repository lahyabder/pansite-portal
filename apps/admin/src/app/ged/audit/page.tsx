'use client';

import { useState, useMemo } from 'react';
import { getAuditLog } from '@pan/shared';
import type { AuditAction, AuditLogEntry } from '@pan/shared';
import { RequirePermission } from '@/lib/auth';

const actionConfig: Record<AuditAction, { label: string; icon: string; color: string }> = {
    create: { label: 'Création', icon: '✨', color: 'text-blue-400' },
    update: { label: 'Modification', icon: '✏️', color: 'text-amber-400' },
    delete: { label: 'Suppression', icon: '🗑️', color: 'text-red-400' },
    submit_for_review: { label: 'Soumis pour révision', icon: '📤', color: 'text-amber-400' },
    approve: { label: 'Approuvé', icon: '✅', color: 'text-emerald-400' },
    publish: { label: 'Publication', icon: '🚀', color: 'text-emerald-400' },
    archive: { label: 'Archivage', icon: '📦', color: 'text-gray-400' },
    restore: { label: 'Restauration', icon: '♻️', color: 'text-blue-400' },
    upload_version: { label: 'Nouvelle version', icon: '📋', color: 'text-cyan-400' },
    download: { label: 'Téléchargement', icon: '⬇️', color: 'text-sky-400' },
    assign: { label: 'Affectation', icon: '👤', color: 'text-purple-400' },
    status_change: { label: 'Changement de statut', icon: '🔄', color: 'text-orange-400' },
    respond: { label: 'Réponse envoyée', icon: '💬', color: 'text-teal-400' },
    login: { label: 'Connexion', icon: '🔑', color: 'text-emerald-400' },
    logout: { label: 'Déconnexion', icon: '🚪', color: 'text-gray-400' },
    failed_login: { label: 'Échec connexion', icon: '🚫', color: 'text-red-400' },
    permission_denied: { label: 'Accès refusé', icon: '⛔', color: 'text-red-500' },
    role_change: { label: 'Changement de rôle', icon: '🛡️', color: 'text-purple-400' },
};

const entityLabels: Record<string, string> = {
    content: 'Contenu',
    document: 'Document',
    service: 'Service',
    request: 'Demande',
    user: 'Utilisateur',
    session: 'Session',
};

export default function AuditLogPage() {
    const allLogs = getAuditLog();
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');
    const [filterEntity, setFilterEntity] = useState<string>('all');
    const [filterUser, setFilterUser] = useState<string>('all');
    const [page, setPage] = useState(1);
    const pageSize = 25;

    // Unique users & actions for filters
    const uniqueUsers = useMemo(() => [...new Set(allLogs.map(l => l.userName))].sort(), [allLogs]);
    const uniqueActions = useMemo(() => [...new Set(allLogs.map(l => l.action))].sort(), [allLogs]);

    // Filter + paginate
    const filtered = useMemo(() => {
        let result = [...allLogs];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(l =>
                l.userName.toLowerCase().includes(q) ||
                l.details?.toLowerCase().includes(q) ||
                l.entityId.toLowerCase().includes(q)
            );
        }
        if (filterAction !== 'all') result = result.filter(l => l.action === filterAction);
        if (filterEntity !== 'all') result = result.filter(l => l.entityType === filterEntity);
        if (filterUser !== 'all') result = result.filter(l => l.userName === filterUser);
        return result;
    }, [allLogs, search, filterAction, filterEntity, filterUser]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    // Stats
    const securityEvents = allLogs.filter(l => ['login', 'logout', 'failed_login', 'permission_denied'].includes(l.action)).length;
    const recentFails = allLogs.filter(l => l.action === 'failed_login').length;

    return (
        <RequirePermission module="audit">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-admin-text">Journal d&apos;audit</h2>
                    <p className="text-admin-text-muted text-sm mt-1">
                        Historique complet de toutes les actions · {allLogs.length} entrée(s)
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-admin-surface rounded-xl p-4 border border-admin-border">
                        <div className="text-admin-text-muted text-xs uppercase tracking-wider">Total actions</div>
                        <div className="text-2xl font-bold text-admin-text mt-1">{allLogs.length}</div>
                    </div>
                    <div className="bg-admin-surface rounded-xl p-4 border border-admin-border">
                        <div className="text-admin-text-muted text-xs uppercase tracking-wider">Événements sécurité</div>
                        <div className="text-2xl font-bold text-admin-text mt-1">{securityEvents}</div>
                    </div>
                    <div className="bg-admin-surface rounded-xl p-4 border border-admin-border">
                        <div className="text-admin-text-muted text-xs uppercase tracking-wider">Échecs connexion</div>
                        <div className="text-2xl font-bold text-red-400 mt-1">{recentFails}</div>
                    </div>
                    <div className="bg-admin-surface rounded-xl p-4 border border-admin-border">
                        <div className="text-admin-text-muted text-xs uppercase tracking-wider">Résultats filtrés</div>
                        <div className="text-2xl font-bold text-admin-primary mt-1">{filtered.length}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Rechercher (utilisateur, détails, ID)..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 min-w-[200px] px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-1 focus:ring-admin-primary"
                    />
                    <select
                        value={filterAction}
                        onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm"
                    >
                        <option value="all">Toutes les actions</option>
                        {uniqueActions.map(a => (
                            <option key={a} value={a}>{actionConfig[a]?.label || a}</option>
                        ))}
                    </select>
                    <select
                        value={filterEntity}
                        onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm"
                    >
                        <option value="all">Toutes les entités</option>
                        {Object.entries(entityLabels).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                    <select
                        value={filterUser}
                        onChange={(e) => { setFilterUser(e.target.value); setPage(1); }}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm"
                    >
                        <option value="all">Tous les utilisateurs</option>
                        {uniqueUsers.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>

                {/* Log entries */}
                <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                    <div className="divide-y divide-admin-border">
                        {paginated.length === 0 ? (
                            <div className="p-10 text-center text-admin-text-muted text-sm">Aucune entrée trouvée.</div>
                        ) : paginated.map((entry) => {
                            const action = actionConfig[entry.action] || { label: entry.action, icon: '❓', color: 'text-gray-400' };
                            const time = new Date(entry.createdAt);
                            const isSecurity = ['login', 'logout', 'failed_login', 'permission_denied'].includes(entry.action);
                            return (
                                <div key={entry.id} className={`px-5 py-4 flex items-start gap-4 hover:bg-admin-surface-alt/30 transition-colors ${isSecurity ? 'border-s-2 border-s-amber-500/50' : ''}`}>
                                    <div className={`text-xl mt-0.5 ${action.color}`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-admin-text text-sm">
                                            <span className="font-semibold">{entry.userName}</span>
                                            {' — '}
                                            <span className={action.color}>{action.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] px-1.5 py-0.5 bg-admin-surface-alt rounded text-admin-text-muted">
                                                {entityLabels[entry.entityType] || entry.entityType}
                                            </span>
                                            <span className="text-admin-text-muted text-xs font-mono">{entry.entityId}</span>
                                            {entry.previousStatus && entry.newStatus && (
                                                <span className="text-admin-text-muted text-xs">
                                                    ({entry.previousStatus} → {entry.newStatus})
                                                </span>
                                            )}
                                        </div>
                                        {entry.details && (
                                            <div className="text-admin-text-muted text-xs mt-1 italic">
                                                {entry.details}
                                            </div>
                                        )}
                                        {entry.ipAddress && (
                                            <div className="text-admin-text-muted text-[10px] mt-1 font-mono">
                                                IP: {entry.ipAddress}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-admin-text-muted text-xs shrink-0 text-end">
                                        <div>{time.toLocaleDateString('fr-FR')}</div>
                                        <div>{time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-admin-text-muted">
                            Page {page} / {totalPages} · {filtered.length} résultat(s)
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 bg-admin-surface border border-admin-border rounded-lg text-admin-text disabled:opacity-30 hover:bg-admin-surface-alt transition-colors"
                            >
                                ← Précédent
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 bg-admin-surface border border-admin-border rounded-lg text-admin-text disabled:opacity-30 hover:bg-admin-surface-alt transition-colors"
                            >
                                Suivant →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </RequirePermission>
    );
}
