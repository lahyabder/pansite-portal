'use client';

import { getAllContents, mockServices, mockStatistics } from '@pan/shared';
import { useI18n } from '@/lib/i18n';
import { Newspaper, Ship, BarChart, PlusCircle, Globe, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllContentsAction } from '../actions';
import type { Content } from '@pan/shared';

export default function CMSDashboard() {
    const { locale } = useI18n();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllContentsAction().then(data => {
            setContents(data);
            setLoading(false);
        });
    }, []);

    const stats = [
        { label: 'Articles Publiés', value: contents.filter(c => c.status === 'published').length, icon: Newspaper, color: 'text-pan-gold', bg: 'bg-pan-gold/10' },
        { label: 'Services Portuaires', value: mockServices.length, icon: Ship, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { label: 'Trafic Annuel', value: mockStatistics[0]?.value.toLocaleString() || '0', icon: TrendingUp, color: 'text-pan-sky', bg: 'bg-pan-sky/10' },
        { label: 'Performance', value: '98%', icon: BarChart, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="space-y-10 max-w-7xl">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Content Studio</h1>
                    <p className="text-white/40">Gérez le contenu public et communiquez avec vos visiteurs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/cms/contents/create" className="flex items-center gap-2 px-5 py-2.5 bg-pan-gold text-pan-navy font-bold rounded-xl hover:scale-105 transition-transform">
                        <PlusCircle className="w-5 h-5" />
                        Nouvel Article
                    </Link>
                    <a href="http://localhost:3000" target="_blank" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                        <Globe className="w-5 h-5" />
                        Voir le site
                    </a>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Card = (
                        <div key={i} className={`bg-[#0a0f1d] border border-white/5 p-6 rounded-3xl relative overflow-hidden group h-full ${stat.label.includes('Articles') ? 'cursor-pointer hover:border-pan-gold/30' : ''}`}>
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-white/40 text-sm font-medium">{stat.label}</div>
                        </div>
                    );

                    if (stat.label.includes('Articles')) {
                        return (
                            <Link key={i} href="/cms/contents?status=published">
                                {Card}
                            </Link>
                        );
                    }

                    return Card;
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Content List */}
                <div className="lg:col-span-2 bg-[#0a0f1d] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-lg">Dernières Publications</h2>
                        <Link href="/cms/contents" className="text-pan-gold text-xs font-bold uppercase tracking-widest hover:underline">Voir tout</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-10 text-center text-white/20 text-sm">Chargement...</div>
                        ) : contents.length === 0 ? (
                            <div className="p-10 text-center text-white/20 text-sm">Aucun contenu trouvé</div>
                        ) : (
                            contents.slice(0, 6).map(content => (
                                <div key={content.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-pan-gold/10 transition-colors">
                                            <Newspaper className="w-6 h-6 text-white/20 group-hover:text-pan-gold transition-colors" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white group-hover:text-pan-gold transition-colors">{content.title.fr}</div>
                                            <div className="text-white/40 text-xs flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase font-bold text-white/60">{content.category}</span>
                                                <span>•</span>
                                                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {content.status === 'published' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-400/10 px-3 py-1.5 rounded-full">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                En Ligne
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-full">
                                                <Clock className="w-3.5 h-3.5" />
                                                Brouillon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>

                {/* Quick Tips / Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-pan-navy to-pan-blue p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pan-gold/10 rounded-full blur-[60px]" />
                        <h3 className="text-xl font-bold mb-4 relative z-10">Optimisation SEO</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10">
                            N'oubliez pas d'ajouter des mots-clés pertinents dans les tags de vos articles pour améliorer la visibilité du Port sur Google.
                        </p>
                        <button className="text-pan-gold font-bold text-sm hover:underline relative z-10">
                            Guide de rédaction →
                        </button>
                    </div>

                    <div className="bg-[#0a0f1d] border border-white/5 p-8 rounded-3xl">
                        <h3 className="font-bold mb-6">Statut de la Zone</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Serveur API</span>
                                <span className="flex items-center gap-2 text-emerald-400 font-bold">● Opérationnel</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Base de données</span>
                                <span className="flex items-center gap-2 text-emerald-400 font-bold">● Connecté</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/40">Mises à jour</span>
                                <span className="text-white/60">v4.2.0-stable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
