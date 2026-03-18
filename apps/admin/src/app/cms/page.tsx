'use client';

import { getAllContents, mockServices, mockStatistics } from '@pan/shared';
import { useI18n } from '@/lib/i18n';
import { Newspaper, Ship, BarChart, PlusCircle, Globe, TrendingUp, CheckCircle, Clock, LayoutDashboard, Settings } from 'lucide-react';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllContentsAction } from '../actions';
import type { Content } from '@pan/shared';

export default function CMSDashboard() {
    const { locale } = useI18n();
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        getAllContentsAction().then(res => {
            if (res.data) {
                // Ensure contents is an array by unwrapping paginated result if needed
                const items = Array.isArray(res.data) ? res.data : (res.data as any).items || [];
                setContents(items);
            } else if (res.error) {
                setApiError(res.error);
            }
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
        <div className="space-y-10 max-w-7xl animate-fade-in">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1d] to-[#1a233b] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pan-gold/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-3 italic">Content Studio</h1>
                        <p className="text-white/40 text-lg max-w-md leading-relaxed">Simplifiez la gestion de votre présence numérique. Organisez, publiez et analysez vos contenus.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/cms/contents/create" className="flex items-center gap-2 px-6 py-3.5 bg-pan-gold text-pan-navy font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-pan-gold/20 transition-all active:scale-95">
                            <PlusCircle className="w-5 h-5" />
                            Nouveau Contenu
                        </Link>
                        <a href="https://www.pan.mr" target="_blank" className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors">
                            <Globe className="w-5 h-5" />
                            Voir le site
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { cat: 'actualite', label: 'Actualités', icon: Newspaper, color: 'text-pan-gold', bg: 'bg-pan-gold/10', count: contents.filter(c => c.category === 'actualite').length },
                    { cat: 'infrastructure', label: 'Infrastructures', icon: LayoutDashboard, color: 'text-pan-sky', bg: 'bg-pan-sky/10', count: contents.filter(c => c.category === 'infrastructure').length },
                    { cat: 'services', label: 'Services', icon: Ship, color: 'text-emerald-400', bg: 'bg-emerald-400/10', count: contents.filter(c => c.category === 'services').length },
                    { cat: 'le-port', label: 'Le Port', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-400/10', count: contents.filter(c => c.category === 'le-port').length },
                ].map((item, i) => (
                    <Link key={i} href={`/cms/contents?category=${item.cat}`} className="bg-[#0a0f1d] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden group hover:border-white/10 transition-all hover:translate-y-[-4px]">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity`} />
                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <item.icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">{item.count}</div>
                                <div className="text-white/40 text-sm font-bold uppercase tracking-widest">{item.label}</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PlusCircle className="w-4 h-4 text-white/40" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Content List */}
                <div className="lg:col-span-2 bg-[#0a0f1d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold text-xl italic tracking-tight">Dernières Publications</h2>
                        <Link href="/cms/contents" className="text-pan-gold text-xs font-bold uppercase tracking-widest hover:underline">Voir tout →</Link>
                    </div>
                    <div className="divide-y divide-white/5 px-4">
                        {loading ? (
                            <div className="p-20 text-center text-white/20 text-sm font-medium">Chargement des données...</div>
                        ) : contents.length === 0 ? (
                            <div className="p-20 text-center text-white/20 text-sm italic font-medium">Aucun contenu trouvé dans la base.</div>
                        ) : (
                            contents.slice(0, 5).map(content => (
                                <div key={content.id} className="px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-all rounded-3xl m-2 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-pan-gold/10 transition-colors border border-white/5">
                                            <Newspaper className="w-7 h-7 text-white/20 group-hover:text-pan-gold transition-colors" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-pan-gold transition-colors text-base">{content.title.fr}</div>
                                            <div className="text-white/40 text-xs flex items-center gap-3 mt-1.5 font-medium uppercase tracking-tight">
                                                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/60">{content.category}</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {content.status === 'published' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-wider bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                En Ligne
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-wider bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                                <Clock className="w-3.5 h-3.5" />
                                                Brouillon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )))}
                    </div>
                </div>

                {/* System Section (Preserved and Refined) */}
                <div className="space-y-8">
                    <div className="bg-[#0a0f1d] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                        <h3 className="font-bold text-lg mb-8 flex items-center gap-3 italic">
                            <span className="w-2 h-6 bg-pan-gold rounded-full" />
                            Système & État
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Serveur API', status: apiError ? 'Erreur Connexion' : 'Opérationnel', color: apiError ? 'text-red-400' : 'text-emerald-400' },
                                { label: 'Base de données', status: apiError ? 'Déconnecté' : 'Connecté', color: apiError ? 'text-red-400' : 'text-emerald-400' },
                                { label: 'Version Logicielle', status: 'v4.5.0-stable', color: 'text-white/60' },
                                { label: 'Cache Système', status: 'Optimisé', color: 'text-pan-sky' },
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-sm group">
                                    <span className="text-white/40 font-medium group-hover:text-white/60 transition-colors">{s.label}</span>
                                    <span className={`flex items-center gap-2 ${s.color} font-bold`}>
                                        {s.color.includes('emerald') && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/5">
                            <Link href="/cms/settings" className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-bold hover:bg-admin-primary transition-all">
                                <Settings className="w-4 h-4" />
                                Paramètres Système
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pan-gold/20 to-transparent p-1 shadow-2xl rounded-[2.5rem]">
                        <div className="bg-[#0a0f1d] p-8 rounded-[2.4rem] h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-pan-gold font-bold text-lg mb-4 italic">Performance SEO</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
                                    Vos derniers articles ont augmenté la visibilité du port de <strong>+12%</strong> ce mois-ci.
                                </p>
                            </div>
                            <button className="text-pan-gold font-bold text-sm hover:underline flex items-center gap-2 group">
                                Analyser les tendances
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
