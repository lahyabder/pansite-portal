'use client';

import { Bell, Search, User, Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-2 w-96">
        <Search className="w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search for pages, images, or settings..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
        />
        <span className="text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</span>
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
