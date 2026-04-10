'use client';

import { Bell, Search, User, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="relative w-96 hidden md:block group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Rechercher des pages, médias, ou paramètres..." 
          className="w-full bg-slate-950/50 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all font-medium"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
          <Globe className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-slate-300">FR / AR</span>
        </div>

        <button className="relative p-2.5 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border-2 border-slate-950"></span>
        </button>

        <div className="h-8 w-[1px] bg-white/5"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none">Admin User</p>
            <p className="text-[10px] font-medium text-sky-500 mt-1 uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg shadow-sky-500/20">
            <User className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
