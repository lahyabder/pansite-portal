'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  ChevronLeft,
  Ship,
  LogOut,
  Users,
  Shield,
  Newspaper,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdminLang } from '@/lib/AdminLangContext';
import { createClient } from '@supabase/supabase-js';

const ALL_MENU_ITEMS = [
  { id: 'dashboard', label: { fr: 'Tableau de Bord', ar: 'لوحة القيادة' }, icon: LayoutDashboard, href: '/', adminOnly: true },
  { id: 'contents', label: { fr: 'Actualités & Contenus', ar: 'الأخبار والمحتوى' }, icon: FileText, href: '/contents', adminOnly: false },
  { id: 'pages', label: { fr: 'Pages Statiques', ar: 'الصفحات الثابتة' }, icon: LayoutDashboard, href: '/pages', adminOnly: true },
  { id: 'media', label: { fr: 'Médiathèque', ar: 'مكتبة الوسائط' }, icon: ImageIcon, href: '/media', adminOnly: true },
  { id: 'users', label: { fr: 'Utilisateurs', ar: 'المستخدمون' }, icon: Users, href: '/users', adminOnly: true },
  { id: 'settings', label: { fr: 'Paramètres', ar: 'الإعدادات' }, icon: Settings, href: '/settings', adminOnly: true },
];

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [role, setRole] = useState<'admin' | 'editor'>('admin');
  const { lang } = useAdminLang();

  useEffect(() => {
    const r = getCookie('pan-admin-role');
    if (r === 'editor') setRole('editor');
  }, []);

  const menuItems = ALL_MENU_ITEMS.filter(item => !item.adminOnly || role === 'admin');

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
    } catch {}

    document.cookie = 'pan-admin-session=; path=/; max-age=0';
    document.cookie = 'pan-admin-role=; path=/; max-age=0';
    window.location.href = '/admin/login';
  };

  return (
    <aside 
      className={`glass-sidebar h-screen sticky top-0 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      } ${lang === 'ar' ? 'border-l border-white/5' : 'border-r border-white/5'}`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-3 transition-opacity ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
            <Ship className="text-white w-6 h-6" />
          </div>
          <span className="font-outfit font-black text-xl tracking-tight text-white whitespace-nowrap">PAN HUB</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors shrink-0"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? (lang === 'ar' ? '-rotate-180' : 'rotate-180') : (lang === 'ar' ? 'rotate-180' : '')}`} />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-6 pb-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider w-fit ${
            role === 'admin'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
          }`}>
            {role === 'admin' ? <Shield className="w-3 h-3" /> : <Newspaper className="w-3 h-3" />}
            {role === 'admin' ? 'Super Admin' : 'Éditeur Actualités'}
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all group ${
                active 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110 shrink-0" />
              {!collapsed && (
                <span className="font-outfit whitespace-nowrap">{item.label[lang]}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
        >
          <LogOut className={`w-5 h-5 shrink-0 ${loggingOut ? 'animate-pulse' : ''}`} />
          {!collapsed && (
            <span className="font-outfit font-medium whitespace-nowrap">
              {loggingOut 
                ? (lang === 'ar' ? 'جاري الخروج...' : 'Déconnexion...') 
                : (lang === 'ar' ? 'تسجيل الخروج' : 'Déconnexion')}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
