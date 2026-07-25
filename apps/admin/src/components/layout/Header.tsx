'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Globe, LogOut, ShieldAlert } from 'lucide-react';
import { useAdminLang } from '@/lib/AdminLangContext';
import { signOutAction } from '@/app/auth-actions';

export default function Header() {
  const { lang, toggleLang } = useAdminLang();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [globalLoggingOut, setGlobalLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async (scope: 'local' | 'global') => {
    if (scope === 'local') setLoggingOut(true);
    if (scope === 'global') setGlobalLoggingOut(true);
    await signOutAction(scope);
  };

  return (
    <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="relative w-96 hidden md:block group">
        <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors`} />
        <input 
          type="text" 
          placeholder={lang === 'ar' ? "ابحث عن صفحات، وسائط، أو إعدادات..." : "Rechercher des pages, médias, ou paramètres..."}
          className={`w-full bg-slate-950/50 border border-slate-800 rounded-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all font-medium`}
        />
        <span className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-700 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700`}>⌘K</span>
      </div>

      <div className="flex items-center gap-6">
        <div 
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group select-none"
        >
          <Globe className="w-4 h-4 text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-slate-300">{lang === 'ar' ? 'عربي / FR' : 'FR / AR'}</span>
        </div>

        <button className="relative p-2.5 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} w-2 h-2 bg-sky-500 rounded-full border-2 border-slate-950`}></span>
        </button>

        <div className="h-8 w-[1px] bg-white/5"></div>

        <div className="relative flex items-center gap-3 pl-2" ref={dropdownRef}>
          <div className={`${lang === 'ar' ? 'text-left' : 'text-right'}`}>
            <p className="text-sm font-bold text-white leading-none">{lang === 'ar' ? 'مدير النظام' : 'Admin User'}</p>
            <p className="text-[10px] font-medium text-sky-500 mt-1 uppercase tracking-wider">{lang === 'ar' ? 'مدير عام' : 'Super Admin'}</p>
          </div>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg shadow-sky-500/20 shrink-0 hover:scale-105 transition-transform cursor-pointer"
          >
            <User className="text-white w-6 h-6" />
          </button>

          {dropdownOpen && (
            <div className={`absolute top-14 ${lang === 'ar' ? 'left-0' : 'right-0'} w-64 glass border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in`}>
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <p className="text-sm font-bold text-white">{lang === 'ar' ? 'مدير النظام' : 'Admin User'}</p>
                <p className="text-xs text-slate-400 mt-1">{lang === 'ar' ? 'مدير عام' : 'Super Admin'}</p>
              </div>
              
              <button 
                onClick={() => handleLogout('local')}
                disabled={loggingOut || globalLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
              >
                <LogOut className={`w-4 h-4 ${loggingOut ? 'animate-pulse' : ''}`} />
                {loggingOut 
                  ? (lang === 'ar' ? 'جاري الخروج...' : 'Déconnexion...') 
                  : (lang === 'ar' ? 'تسجيل الخروج' : 'Déconnexion')}
              </button>

              <button 
                onClick={() => handleLogout('global')}
                disabled={loggingOut || globalLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50 mt-1"
              >
                <ShieldAlert className={`w-4 h-4 ${globalLoggingOut ? 'animate-pulse' : ''}`} />
                {globalLoggingOut 
                  ? (lang === 'ar' ? 'جاري الخروج...' : 'Déconnexion globale...') 
                  : (lang === 'ar' ? 'الخروج من كل الأجهزة' : 'Déconnexion globale')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
