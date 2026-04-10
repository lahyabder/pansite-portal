'use client';

import { 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Activity,
  ArrowUpRight,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { label: 'Pages Publiées', value: '12', icon: FileText, trend: '+2 ce mois-ci', color: 'bg-sky-500' },
  { label: 'Média Assets', value: '148', icon: ImageIcon, trend: '4.2 GB utilisés', color: 'bg-indigo-500' },
  { label: 'Utilisateurs', value: '3', icon: Users, trend: '2 en ligne', color: 'bg-emerald-500' },
  { label: 'Visites (Mois)', value: '1.2k', icon: Activity, trend: '+12%', color: 'bg-amber-500' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-black text-white">Salut, Admin 👋</h1>
          <p className="text-slate-400 mt-2 font-medium">Bienvenue sur le centre de commande du Port Autonome de Nouadhibou.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/pages/create"
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Page
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.color} shadow-lg shadow-current/20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div className="mt-6">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
              Pages Récemment Modifiées
            </h2>
            <Link href="/pages" className="text-sm font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group">
              Voir tout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {['Accueil', 'Le Port', 'Services'].map((page, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-sky-500">
                    {page[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{page}</p>
                    <p className="text-xs text-slate-500 mt-1">Modifiée il y a 2 heures par Admin</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">Publiée</span>
                  <button className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl shadow-xl shadow-orange-500/20 flex items-center justify-center">
            <Zap className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-extra-bold text-white">Prêt pour l'action ?</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">Le site est à jour et performant. Vous avez le contrôle total sur chaque composant.</p>
          </div>
          <button className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 transition-colors">
            Voir le Guide Complet
          </button>
        </div>
      </div>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.71 11.29 2 9.29 9.3h5.71L7.71 22l2-7.29z"/></svg>
  );
}
