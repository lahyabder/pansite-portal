'use client';

import { useState } from 'react';
import type { Request, RequestStatus, RequestType } from '@pan/shared';
import { Search, Mail, Phone, Building, Calendar, ChevronDown, ChevronUp, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// ─── Demo requests data ───────────────────────────────────────
const DEMO_REQUESTS: Request[] = [
    {
        id: 'req-001',
        reference: 'PAN-REQ-2025-001',
        type: 'information',
        subject: 'Tarifs de stationnement des navires',
        message: 'Bonjour, je souhaiterais obtenir des informations sur les tarifs de stationnement pour un navire de commerce de 150m. Merci de me faire parvenir la grille tarifaire complète.',
        senderName: 'Mohammed Al-Rashid',
        senderEmail: 'admin@shipping.com',
        senderPhone: '+222 22 11 00 99',
        senderCompany: 'Gulf Shipping Co.',
        status: 'new',
        priority: 'normal',
        attachments: [],
        statusHistory: [],
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'req-002',
        reference: 'PAN-REQ-2025-002',
        type: 'rendez_vous',
        subject: 'Demande de rendez-vous avec la Direction Commerciale',
        message: 'Notre société souhaite discuter d\'un partenariat potentiel pour l\'exploitation de nouvelles routes commerciales via Nouadhibou. Nous sollicitons un rendez-vous avec la Direction Commerciale.',
        senderName: 'Jean-Pierre Dubois',
        senderEmail: 'jp.dubois@logistique-europe.fr',
        senderPhone: '+33 6 78 90 12 34',
        senderCompany: 'Logistique Europe SAS',
        status: 'assigned',
        priority: 'high',
        assignedToName: 'Direction Commerciale',
        attachments: [],
        statusHistory: [
            { id: 'h1', status: 'assigned', comment: 'Transmis à la Direction Commerciale', changedBy: 'admin', changedByName: 'Admin', createdAt: new Date(Date.now() - 3600000).toISOString() }
        ],
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'req-003',
        reference: 'PAN-REQ-2025-003',
        type: 'reclamation',
        subject: 'Retard dans le traitement des documents douaniers',
        message: 'Suite à l\'accostage de notre navire MV ATLAS le 12/03/2025, nous constatons un retard anormal dans le traitement de nos documents douaniers. Cela cause des surcoûts importants pour notre compagnie.',
        senderName: 'Ahmed Ould Brahim',
        senderEmail: 'a.brahim@mauritanie-maritime.mr',
        senderPhone: '+222 36 12 34 56',
        senderCompany: 'Mauritanie Maritime SARL',
        status: 'in_progress',
        priority: 'urgent',
        assignedToName: 'Direction Exploitation',
        attachments: [],
        statusHistory: [
            { id: 'h1', status: 'assigned', changedBy: 'admin', changedByName: 'Admin', createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
            { id: 'h2', status: 'in_progress', comment: 'En cours d\'investigation avec les services douaniers', changedBy: 'admin', changedByName: 'Admin', createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
        id: 'req-004',
        reference: 'PAN-REQ-2025-004',
        type: 'information',
        subject: 'Procédures pour import de matériel industriel',
        message: 'Je suis importateur de matériel industriel et je voudrais connaître les procédures à suivre pour importer des équipements lourds via le Port de Nouadhibou.',
        senderName: 'Fatima Vall',
        senderEmail: 'f.vall@industrie-mr.com',
        senderPhone: '+222 44 55 66 77',
        status: 'closed',
        priority: 'low',
        responseMessage: 'Bonjour Mme Vall, nous vous remercions de votre intérêt. Vous trouverez ci-joint la liste des procédures d\'importation. N\'hésitez pas à nous contacter pour toute question.',
        attachments: [],
        statusHistory: [],
        createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
        closedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    },
];

const statusConfig: Record<RequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
    new:                { label: 'Nouvelle',           color: 'bg-blue-50 text-blue-700 border border-blue-200',     icon: <Mail className="w-3.5 h-3.5" /> },
    assigned:           { label: 'Assignée',           color: 'bg-amber-50 text-amber-700 border border-amber-200',  icon: <Clock className="w-3.5 h-3.5" /> },
    in_progress:        { label: 'En traitement',      color: 'bg-indigo-50 text-indigo-700 border border-indigo-200', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    waiting_more_info:  { label: 'En attente info',    color: 'bg-orange-50 text-orange-700 border border-orange-200', icon: <Clock className="w-3.5 h-3.5" /> },
    approved:           { label: 'Approuvée',          color: 'bg-green-50 text-green-700 border border-green-200',  icon: <CheckCircle className="w-3.5 h-3.5" /> },
    rejected:           { label: 'Rejetée',            color: 'bg-red-50 text-red-600 border border-red-200',        icon: <XCircle className="w-3.5 h-3.5" /> },
    closed:             { label: 'Clôturée',           color: 'bg-gray-100 text-gray-600 border border-gray-200',    icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const typeLabels: Record<RequestType, string> = {
    information:  'Information',
    reclamation:  'Réclamation',
    rendez_vous:  'Rendez-vous',
};

const priorityColors: Record<string, string> = {
    low:    'text-gray-400',
    normal: 'text-blue-500',
    high:   'text-amber-500',
    urgent: 'text-red-500',
};

const priorityLabels: Record<string, string> = {
    low: 'Basse', normal: 'Normale', high: 'Haute', urgent: 'Urgente',
};

function formatRelativeDate(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `Il y a ${hrs}h`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function RequestCard({ req }: { req: Request }) {
    const [expanded, setExpanded] = useState(false);
    const st = statusConfig[req.status];

    return (
        <div className="bg-white rounded-2xl border border-pan-gray-100 shadow-sm overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${req.priority === 'urgent' ? 'bg-red-100' : req.priority === 'high' ? 'bg-amber-100' : 'bg-pan-gray-100'}`}>
                        <MessageSquare className={`w-5 h-5 ${priorityColors[req.priority]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-pan-gray-400 font-mono">{req.reference}</span>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${st.color}`}>
                                {st.icon}{st.label}
                            </span>
                            <span className="text-xs text-pan-gray-400 bg-pan-gray-100 px-2 py-0.5 rounded-full">
                                {typeLabels[req.type]}
                            </span>
                            <span className={`text-xs font-bold ${priorityColors[req.priority]}`}>
                                ● {priorityLabels[req.priority]}
                            </span>
                        </div>
                        <h3 className="font-semibold text-pan-navy text-sm truncate">{req.subject}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-pan-gray-500">
                            <span className="flex items-center gap-1"><span className="font-semibold">{req.senderName}</span></span>
                            {req.senderEmail && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{req.senderEmail}</span>}
                            {req.senderPhone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{req.senderPhone}</span>}
                            {req.senderCompany && <span className="flex items-center gap-1"><Building className="w-3 h-3" />{req.senderCompany}</span>}
                            <span className="flex items-center gap-1 ml-auto"><Calendar className="w-3 h-3" />{formatRelativeDate(req.createdAt)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="p-2 text-pan-gray-400 hover:text-pan-navy hover:bg-pan-gray-100 rounded-xl transition-colors flex-shrink-0"
                    >
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {expanded && (
                    <div className="mt-4 space-y-4">
                        <div className="bg-pan-gray-50 rounded-xl p-4 text-sm text-pan-gray-700 leading-relaxed border border-pan-gray-100">
                            {req.message}
                        </div>

                        {req.responseMessage && (
                            <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800 border border-green-200">
                                <p className="text-xs font-bold text-green-600 mb-1">Réponse envoyée :</p>
                                {req.responseMessage}
                            </div>
                        )}

                        {req.statusHistory.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-pan-gray-400 mb-2 uppercase tracking-wider">Historique</p>
                                <div className="space-y-2">
                                    {req.statusHistory.map(h => (
                                        <div key={h.id} className="flex items-start gap-2 text-xs text-pan-gray-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-pan-gray-300 mt-1.5 flex-shrink-0" />
                                            <span>
                                                <span className="font-semibold">{statusConfig[h.status]?.label}</span>
                                                {h.comment && ` — ${h.comment}`}
                                                <span className="text-pan-gray-300 ml-2">{formatRelativeDate(h.createdAt)}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {req.status !== 'closed' && req.status !== 'rejected' && (
                            <div className="flex gap-2 pt-1">
                                <button className="px-4 py-2 text-xs font-bold bg-pan-navy text-white rounded-xl hover:bg-pan-blue transition-colors">
                                    Répondre
                                </button>
                                <button className="px-4 py-2 text-xs font-bold bg-white border border-pan-gray-200 text-pan-gray-600 rounded-xl hover:border-pan-sky hover:text-pan-sky transition-colors">
                                    Assigner
                                </button>
                                <button className="px-4 py-2 text-xs font-bold bg-green-50 border border-green-200 text-green-700 rounded-xl hover:bg-green-100 transition-colors ml-auto">
                                    Clôturer
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const filtered = DEMO_REQUESTS.filter(r => {
        const matchSearch = !search || r.senderName.toLowerCase().includes(search.toLowerCase()) || r.subject.toLowerCase().includes(search.toLowerCase()) || r.reference.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || r.status === statusFilter;
        const matchType = !typeFilter || r.type === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const newCount = DEMO_REQUESTS.filter(r => r.status === 'new').length;
    const urgentCount = DEMO_REQUESTS.filter(r => r.priority === 'urgent').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Messages de contact</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">
                        {DEMO_REQUESTS.length} message(s) · {newCount} nouveau(x)
                    </p>
                </div>
                {urgentCount > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold text-red-700">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {urgentCount} message(s) urgent(s)
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
                {(Object.keys(statusConfig) as RequestStatus[]).map(status => {
                    const count = DEMO_REQUESTS.filter(r => r.status === status).length;
                    const cfg = statusConfig[status];
                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(s => s === status ? '' : status)}
                            className={`bg-white rounded-2xl border shadow-sm p-3 text-center transition-all hover:shadow-md ${statusFilter === status ? 'border-pan-sky ring-2 ring-pan-sky/20' : 'border-pan-gray-100'}`}
                        >
                            <p className="text-xl font-bold text-pan-navy">{count}</p>
                            <p className="text-[10px] text-pan-gray-400 mt-0.5 leading-tight">{cfg.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, sujet ou référence..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 bg-white"
                >
                    <option value="">Tous les statuts</option>
                    {(Object.keys(statusConfig) as RequestStatus[]).map(s => (
                        <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                </select>
                <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm text-pan-gray-700 focus:outline-none focus:ring-2 focus:ring-pan-sky/20 bg-white"
                >
                    <option value="">Tous les types</option>
                    {(Object.keys(typeLabels) as RequestType[]).map(t => (
                        <option key={t} value={t}>{typeLabels[t]}</option>
                    ))}
                </select>
            </div>

            {/* Message list */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="bg-white rounded-2xl border border-pan-gray-100 p-12 text-center text-pan-gray-400">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="font-medium">Aucun message</p>
                        <p className="text-sm mt-1">Modifiez vos filtres pour voir plus de résultats</p>
                    </div>
                )}
                {filtered.map(req => (
                    <RequestCard key={req.id} req={req} />
                ))}
            </div>
        </div>
    );
}