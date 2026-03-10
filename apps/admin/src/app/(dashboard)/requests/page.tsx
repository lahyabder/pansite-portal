'use client';

import { useState } from 'react';
import type { RequestStatus, RequestType, RequestPriority, DocumentDirection, Request } from '@pan/shared';
import { getAllRequests, changeRequestStatus, assignRequest, respondToRequest, getRequestStats } from '@pan/shared';
import Link from 'next/link';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

export default function RequestsPage() {
    const { t, locale } = useI18n();
    const { session, can } = useAuth();

    // Configs derived from dictionary
    const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
        new: { label: t.requestsManagement.statuses.new, color: 'text-blue-400', bg: 'bg-blue-500/15' },
        assigned: { label: t.requestsManagement.statuses.assigned, color: 'text-purple-400', bg: 'bg-purple-500/15' },
        in_progress: { label: t.requestsManagement.statuses.in_progress, color: 'text-amber-400', bg: 'bg-amber-500/15' },
        waiting_more_info: { label: t.requestsManagement.statuses.waiting_more_info, color: 'text-orange-400', bg: 'bg-orange-500/15' },
        approved: { label: t.requestsManagement.statuses.approved, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
        rejected: { label: t.requestsManagement.statuses.rejected, color: 'text-red-400', bg: 'bg-red-500/15' },
        closed: { label: t.requestsManagement.statuses.closed, color: 'text-gray-400', bg: 'bg-gray-500/15' },
    };

    const typeConfig: Record<RequestType, { label: string; icon: string }> = {
        information: { label: t.requestsManagement.types.information, icon: 'ℹ️' },
        reclamation: { label: t.requestsManagement.types.reclamation, icon: '⚠️' },
        document_request: { label: t.requestsManagement.types.document_request, icon: '📄' },
        rendez_vous: { label: t.requestsManagement.types.rendez_vous, icon: '📅' },
    };

    const priorityConfig: Record<RequestPriority, { label: string; color: string }> = {
        low: { label: t.requestsManagement.priorities.low, color: 'text-gray-400' },
        normal: { label: t.requestsManagement.priorities.normal, color: 'text-blue-400' },
        high: { label: t.requestsManagement.priorities.high, color: 'text-amber-400' },
        urgent: { label: t.requestsManagement.priorities.urgent, color: 'text-red-400' },
    };

    const departments: { value: DocumentDirection; label: string }[] = [
        { value: 'direction_generale', label: t.directions.direction_generale },
        { value: 'direction_exploitation', label: t.directions.direction_exploitation },
        { value: 'direction_commerciale', label: t.directions.direction_commerciale },
        { value: 'direction_technique', label: t.directions.direction_technique },
        { value: 'direction_financiere', label: t.directions.direction_financiere },
        { value: 'direction_rh', label: t.directions.direction_rh },
        { value: 'capitainerie', label: t.directions.capitainerie },
        { value: 'securite', label: t.directions.securite },
    ];
    const [reqs, setReqs] = useState<Request[]>(getAllRequests());
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [selectedReq, setSelectedReq] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');
    const [statusComment, setStatusComment] = useState('');
    const [assignDept, setAssignDept] = useState<DocumentDirection>('direction_generale');

    const stats = getRequestStats();

    function refresh() { setReqs(getAllRequests()); }

    function handleAssign(id: string) {
        if (!session || !can('requests', 'edit')) return;
        assignRequest(id, session.user.id, session.user.name, assignDept, session.user.id);
        refresh();
    }

    function handleStatusChange(id: string, newStatus: RequestStatus) {
        if (!session || !can('requests', 'approve')) return;
        changeRequestStatus(id, newStatus, statusComment, session.user.id, session.user.name);
        setStatusComment('');
        refresh();
    }

    function handleRespond(id: string) {
        if (!session || !responseText.trim() || !can('requests', 'edit')) return;
        respondToRequest(id, responseText, session.user.id, session.user.name);
        setResponseText('');
        refresh();
    }

    // Filters
    let filtered = [...reqs];
    if (filterStatus !== 'all') filtered = filtered.filter(r => r.status === filterStatus);
    if (filterType !== 'all') filtered = filtered.filter(r => r.type === filterType);
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(r =>
            r.subject.toLowerCase().includes(q) ||
            r.senderName.toLowerCase().includes(q) ||
            r.reference.toLowerCase().includes(q)
        );
    }

    const selected = selectedReq ? reqs.find(r => r.id === selectedReq) || null : null;

    return (
        <RequirePermission module="requests">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">{t.requestsManagement.queue}</h2>
                        <p className="text-admin-text-muted text-sm mt-1">{t.requestsManagement.stats(stats.total, stats.avgProcessingHours)}</p>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-7 gap-3">
                    {(Object.entries(statusConfig) as [RequestStatus, typeof statusConfig[RequestStatus]][]).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
                            className={`bg-admin-surface rounded-xl p-3 border transition-all text-center ${filterStatus === key ? 'border-admin-primary ring-1 ring-admin-primary/30' : 'border-admin-border hover:border-admin-border/80'
                                }`}
                        >
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                            <div className="text-xl font-bold text-admin-text mt-1.5">{stats.byStatus[key] || 0}</div>
                        </button>
                    ))}
                </div>

                {/* Per-service breakdown */}
                {stats.byService.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                        {stats.byService.map(s => (
                            <div key={s.serviceId} className="bg-admin-surface rounded-xl p-3 border border-admin-border">
                                <div className="text-admin-text-muted text-xs">{s.serviceName}</div>
                                <div className="text-lg font-bold text-admin-text mt-0.5">{s.count} <span className="text-xs text-admin-text-muted font-normal">{t.common.type}(s)</span></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder={t.requestsManagement.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-1 focus:ring-admin-primary"
                    />
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-3 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm"
                    >
                        <option value="all">{t.requestsManagement.allTypes}</option>
                        {Object.entries(typeConfig).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                        ))}
                    </select>
                </div>

                {/* Main layout: list + detail */}
                <div className="grid grid-cols-5 gap-4">
                    {/* Request list */}
                    <div className={`${selected ? 'col-span-2' : 'col-span-5'} bg-admin-surface rounded-xl border border-admin-border divide-y divide-admin-border overflow-auto max-h-[65vh]`}>
                        {filtered.length === 0 ? (
                            <div className="p-10 text-center text-admin-text-muted text-sm">{t.requestsManagement.noRequests}</div>
                        ) : (
                            filtered.map((req) => {
                                const st = statusConfig[req.status];
                                const tp = typeConfig[req.type];
                                const pr = priorityConfig[req.priority];
                                return (
                                    <button
                                        key={req.id}
                                        onClick={() => setSelectedReq(req.id)}
                                        className={`w-full text-start p-4 hover:bg-admin-surface-alt/50 transition-colors ${selectedReq === req.id ? 'bg-admin-surface-alt/70 border-l-2 border-l-admin-primary' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs">{tp.icon}</span>
                                            <span className="text-admin-text text-sm font-medium flex-1 truncate">{req.subject}</span>
                                            {req.priority === 'urgent' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.bg} ${st.color}`}>{st.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-admin-text-muted">
                                            <span className="font-mono">{req.reference}</span>
                                            <span>·</span>
                                            <span>{req.senderName}</span>
                                            <span>·</span>
                                            <span className={pr.color}>{pr.label}</span>
                                        </div>
                                        <div className="text-admin-text-muted text-xs mt-1 truncate">{req.message}</div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Detail panel */}
                    {selected && (
                        <div className="col-span-3 bg-admin-surface rounded-xl border border-admin-border overflow-auto max-h-[65vh]">
                            <div className="p-6 space-y-5">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm">{typeConfig[selected.type].icon}</span>
                                            <h3 className="text-lg font-bold text-admin-text">{selected.subject}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-admin-text-muted">
                                            <span className="font-mono bg-admin-surface-alt px-2 py-0.5 rounded">{selected.reference}</span>
                                            <span className={`${statusConfig[selected.status].bg} ${statusConfig[selected.status].color} text-[10px] px-2 py-0.5 rounded-full font-semibold`}>
                                                {statusConfig[selected.status].label}
                                            </span>
                                            <span className={priorityConfig[selected.priority].color}>⬤ {priorityConfig[selected.priority].label}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedReq(null)} className="text-admin-text-muted hover:text-admin-text text-sm">✕</button>
                                </div>

                                {/* Sender info */}
                                <div className="bg-admin-surface-alt rounded-xl p-4 space-y-1.5">
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.requestsManagement.sender}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-admin-text-muted">{t.common.title}:</span> <span className="text-admin-text">{selected.senderName}</span></div>
                                        <div><span className="text-admin-text-muted">Email:</span> <span className="text-admin-text">{selected.senderEmail}</span></div>
                                        {selected.senderPhone && <div><span className="text-admin-text-muted">Tél:</span> <span className="text-admin-text">{selected.senderPhone}</span></div>}
                                        {selected.senderCompany && <div><span className="text-admin-text-muted">Entreprise:</span> <span className="text-admin-text">{selected.senderCompany}</span></div>}
                                    </div>
                                    {selected.serviceName && (
                                        <div className="text-sm mt-1"><span className="text-admin-text-muted">{t.sidebar.services}:</span> <span className="text-admin-primary">{selected.serviceName}</span></div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.requestsManagement.message}</h4>
                                    <p className="text-admin-text text-sm leading-relaxed bg-admin-surface-alt rounded-xl p-4">{selected.message}</p>
                                </div>

                                {/* Attachments */}
                                {selected.attachments.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-2">{t.requestsManagement.attachments(selected.attachments.length)}</h4>
                                        <div className="space-y-2">
                                            {selected.attachments.map(att => (
                                                <div key={att.id} className="flex items-center gap-3 bg-admin-surface-alt rounded-lg p-3">
                                                    <span className="text-lg">📎</span>
                                                    <div className="flex-1">
                                                        <div className="text-sm text-admin-text">{att.fileName}</div>
                                                        <div className="text-xs text-admin-text-muted">{(att.fileSize / 1024).toFixed(0)} Ko</div>
                                                    </div>
                                                    <button className="text-admin-primary text-sm hover:underline">{t.common.save}</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Response message */}
                                {selected.responseMessage && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                        <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">💬 {t.requestsManagement.responseSent}</h4>
                                        <p className="text-admin-text text-sm">{selected.responseMessage}</p>
                                    </div>
                                )}

                                {/* Actions panel */}
                                <div className="border-t border-admin-border pt-5 space-y-4">
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">{t.requestsManagement.actions}</h4>

                                    {/* Assignment */}
                                    {(selected.status === 'new') && (
                                        <div className="flex items-center gap-3">
                                            <select
                                                value={assignDept}
                                                onChange={e => setAssignDept(e.target.value as DocumentDirection)}
                                                className="flex-1 px-3 py-2 bg-admin-surface-alt border border-admin-border rounded-lg text-admin-text text-sm"
                                            >
                                                {departments.map(d => (
                                                    <option key={d.value} value={d.value}>{d.label}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => handleAssign(selected.id)}
                                                className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
                                            >
                                                👤 {t.requestsManagement.assign}
                                            </button>
                                        </div>
                                    )}

                                    {/* Status change buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {selected.status !== 'in_progress' && selected.status !== 'closed' && selected.status !== 'rejected' && (
                                            <button onClick={() => handleStatusChange(selected.id, 'in_progress')} className="px-3 py-1.5 bg-amber-500/15 text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-500/25 transition-colors">
                                                ▶ {t.requestsManagement.statuses.in_progress}
                                            </button>
                                        )}
                                        {selected.status !== 'waiting_more_info' && selected.status !== 'closed' && (
                                            <button onClick={() => handleStatusChange(selected.id, 'waiting_more_info')} className="px-3 py-1.5 bg-orange-500/15 text-orange-400 text-xs font-semibold rounded-lg hover:bg-orange-500/25 transition-colors">
                                                ⏳ {t.requestsManagement.statuses.waiting_more_info}
                                            </button>
                                        )}
                                        {selected.status !== 'approved' && selected.status !== 'closed' && selected.status !== 'rejected' && (
                                            <button onClick={() => handleStatusChange(selected.id, 'approved')} className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/25 transition-colors">
                                                ✅ {t.requestsManagement.statuses.approved}
                                            </button>
                                        )}
                                        {selected.status !== 'rejected' && selected.status !== 'closed' && (
                                            <button onClick={() => handleStatusChange(selected.id, 'rejected')} className="px-3 py-1.5 bg-red-500/15 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/25 transition-colors">
                                                ✗ {t.requestsManagement.statuses.rejected}
                                            </button>
                                        )}
                                        {selected.status !== 'closed' && (
                                            <button onClick={() => handleStatusChange(selected.id, 'closed')} className="px-3 py-1.5 bg-gray-500/15 text-gray-400 text-xs font-semibold rounded-lg hover:bg-gray-500/25 transition-colors">
                                                🔒 {t.requestsManagement.statuses.closed}
                                            </button>
                                        )}
                                    </div>

                                    {/* Status comment */}
                                    <input
                                        type="text"
                                        placeholder={t.requestsManagement.commentPlaceholder}
                                        value={statusComment}
                                        onChange={(e) => setStatusComment(e.target.value)}
                                        className="w-full px-3 py-2 bg-admin-surface-alt border border-admin-border rounded-lg text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-1 focus:ring-admin-primary"
                                    />

                                    {/* Response form */}
                                    <div className="flex gap-2">
                                        <textarea
                                            placeholder={t.requestsManagement.responsePlaceholder}
                                            value={responseText}
                                            onChange={(e) => setResponseText(e.target.value)}
                                            rows={2}
                                            className="flex-1 px-3 py-2 bg-admin-surface-alt border border-admin-border rounded-lg text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-1 focus:ring-admin-primary resize-none"
                                        />
                                        <button
                                            onClick={() => handleRespond(selected.id)}
                                            disabled={!responseText.trim()}
                                            className="px-4 self-end py-2 bg-admin-primary text-white text-sm font-medium rounded-lg hover:bg-admin-primary/80 transition-colors disabled:opacity-50"
                                        >
                                            💬 {t.requestsManagement.respond}
                                        </button>
                                    </div>
                                </div>

                                {/* Status history timeline */}
                                <div className="border-t border-admin-border pt-5">
                                    <h4 className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider mb-3">{t.requestsManagement.history}</h4>
                                    <div className="space-y-3">
                                        {[...selected.statusHistory].reverse().map((entry) => {
                                            const stCfg = statusConfig[entry.status];
                                            return (
                                                <div key={entry.id} className="flex gap-3 text-sm">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-2.5 h-2.5 rounded-full mt-1 ${stCfg.bg.replace('/15', '')} border-2 border-admin-surface`} />
                                                        <div className="w-px flex-1 bg-admin-border" />
                                                    </div>
                                                    <div className="pb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`${stCfg.color} font-semibold text-xs`}>{stCfg.label}</span>
                                                            <span className="text-admin-text-muted text-xs">par {entry.changedByName}</span>
                                                        </div>
                                                        {entry.comment && <p className="text-admin-text-muted text-xs mt-0.5 italic">{entry.comment}</p>}
                                                        <span className="text-admin-text-muted text-xs">{new Date(entry.createdAt).toLocaleString(locale)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RequirePermission>
    );
}
