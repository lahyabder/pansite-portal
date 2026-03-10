'use client';

import { getAllRequests } from '@pan/shared';
import { FileText, FolderSync, ShieldCheck, Mail, Database, Search, Download, Clock } from 'lucide-react';
import Link from 'next/link';

export default function GEDDashboard() {
    const requests = getAllRequests();

    const stats = [
        { label: 'Documents Total', value: '1,248', icon: FileText, color: 'text-pan-sky', bg: 'bg-pan-sky/10' },
        { label: 'Demandes Entrantes', value: requests.filter(r => r.status === 'new').length, icon: Mail, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Stockage Utilisé', value: '4.2 GB', icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Accès Sécurisés', value: '24', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="space-y-10 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Centre Documentaire (GED)</h1>
                    <p className="text-white/40">Système sécurisé d'archivage et de gestion des flux documentaires.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Rechercher un document..."
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-blue/50 w-64 text-white"
                        />
                    </div>
                    <Link href="/ged/documents/create" className="flex items-center gap-2 px-5 py-2.5 bg-pan-blue text-white font-bold rounded-xl hover:scale-105 transition-transform">
                        <FolderSync className="w-5 h-5" />
                        Archiver un Document
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-white/40 text-sm font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Requests List */}
                <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Demandes de Documents Récentes</h2>
                        <Link href="/ged/requests" className="text-pan-sky text-xs font-bold uppercase tracking-widest hover:underline">Voir tout</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {requests.slice(0, 6).map(req => (
                            <div key={req.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-pan-blue/10 transition-colors">
                                        <Mail className="w-6 h-6 text-white/20 group-hover:text-pan-sky transition-colors" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white group-hover:text-pan-sky transition-colors">{req.subject}</div>
                                        <div className="text-white/40 text-xs flex items-center gap-2 mt-1">
                                            <span className="font-bold text-pan-sky/80">{req.senderName}</span>
                                            <span>•</span>
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {req.status === 'new' ? (
                                        <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider bg-amber-400/10 px-3 py-1.5 rounded-full">
                                            <Clock className="w-3.5 h-3.5" />
                                            En attente
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-400/10 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-400/5">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Traité
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-pan-blue/30 p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pan-blue/20 rounded-full blur-[60px]" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Conformité RGPD</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10">
                            Tous les documents archivés sont cryptés avec AES-256. L'accès est tracé et audité en temps réel.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-pan-sky uppercase tracking-widest relative z-10">
                            <ShieldCheck className="w-4 h-4" /> Certification active
                        </div>
                    </div>

                    <div className="bg-[#0f172a] border border-white/5 p-8 rounded-3xl">
                        <h3 className="font-bold mb-6">Activité de Stockage</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-white/40 mb-1">
                                    <span>Quota Cloud (AWS S3)</span>
                                    <span>42% utilisé</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-pan-sky rounded-full w-[42%]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <Download className="w-5 h-5 text-white/40 mb-2" />
                                    <span className="text-[10px] font-bold text-white/60 uppercase">Export Log</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <Database className="w-5 h-5 text-white/40 mb-2" />
                                    <span className="text-[10px] font-bold text-white/60 uppercase">Backup</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
