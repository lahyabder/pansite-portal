'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Languages, 
  Settings, 
  Menu as MenuIcon,
  ChevronLeft,
  Ship,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { useState } from 'react';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, href: '/' },
  { id: 'pages', label: 'Pages', icon: FileText, href: '/pages' },
  { id: 'media', label: 'Médiathèque', icon: ImageIcon, href: '/media' },
  { id: 'translations', label: 'Traductions', icon: Languages, href: '/translations' },
  { id: 'navigation', label: 'Navigation', icon: MenuIcon, href: '/menus' },
  { id: 'settings', label: 'Paramètres Généraux', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`glass-sidebar h-screen sticky top-0 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-3 transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Ship className="text-white w-6 h-6" />
          </div>
          <span className="font-outfit font-black text-xl tracking-tight text-white">PAN HUB</span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {MENU_ITEMS.map((item) => {
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
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
              {!collapsed && (
                <span className="font-outfit whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-outfit font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
