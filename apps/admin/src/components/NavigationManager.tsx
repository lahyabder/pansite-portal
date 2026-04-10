'use client';

import { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  Save, 
  RefreshCw, 
  Plus, 
  GripVertical, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Check
} from 'lucide-react';
import { getMenuAction, updateMenuAction, createMenuAction } from '@/app/actions';

const MENU_LOCATIONS = [
  { id: 'main', label: 'Menu Principal' },
  { id: 'header_top', label: 'Lien du Haut' },
  { id: 'footer', label: 'Menu Pied de Page' },
];

export default function NavigationManager() {
  const [activeLocation, setActiveLocation] = useState<'main' | 'header_top' | 'footer'>('main');
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getMenuAction(activeLocation);
    
    if (data) {
      setMenu(data);
    } else {
      setMenu({ location: activeLocation, items: [], name: activeLocation });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [activeLocation]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (menu.id) {
        await updateMenuAction(menu.id, menu);
      } else {
        await createMenuAction(menu);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving menu');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    const newItem = { id: Math.random().toString(36).substr(2, 9), label: { fr: 'Nouvel Item' }, href: '/', order: menu.items.length };
    setMenu({ ...menu, items: [...menu.items, newItem] });
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-600 gap-4">
      <RefreshCw className="w-10 h-10 animate-spin" />
      <p className="font-bold">Accessing navigation trees...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-black text-white">Gestion de la Navigation</h1>
          <p className="text-slate-400 mt-2 font-medium">Structurez les menus et liens de votre portail.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-950 shadow-white/10 hover:scale-105'
          }`}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement...' : saved ? 'Archivé !' : 'Publier le Menu'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Emplacements</h3>
          <nav className="space-y-2">
            {MENU_LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc.id as any)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeLocation === loc.id 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <MenuIcon className="w-4 h-4" />
                {loc.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card rounded-[2.5rem] p-10">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold text-white">Items du {MENU_LOCATIONS.find(l=>l.id===activeLocation)?.label}</h2>
                 <button 
                  onClick={addItem}
                  className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-sky-400 hover:bg-sky-500 hover:text-white transition-all"
                 >
                   <Plus className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-3">
                 {menu.items.length === 0 && (
                   <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-slate-600 font-bold">Ce menu est vide. Ajoutez des liens pour commencer.</p>
                   </div>
                 )}
                 {menu.items.map((item: any, idx: number) => (
                   <div key={item.id || idx} className="flex items-center gap-4 bg-slate-950/50 border border-slate-800 p-4 rounded-2xl group group-hover:border-white/10 transition-all">
                      <button className="p-2 text-slate-700 hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 flex-1">
                         <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest pl-1">Label (FR)</label>
                            <input 
                              type="text" 
                              value={item.label?.fr || ''}
                              onChange={e => {
                                 const next = {...menu};
                                 next.items[idx].label = { ...next.items[idx].label, fr: e.target.value };
                                 setMenu(next);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest pl-1">URL / Slug</label>
                            <input 
                              type="text" 
                              value={item.href || ''}
                              onChange={e => {
                                 const next = {...menu};
                                 next.items[idx].href = e.target.value;
                                 setMenu(next);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-sky-400 outline-none"
                            />
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="p-2 text-slate-700 hover:text-white transition-colors"><Globe className="w-4 h-4" /></button>
                         <button 
                           onClick={() => {
                             const next = {...menu};
                             next.items.splice(idx, 1);
                             setMenu(next);
                           }}
                           className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-sky-500/5 border border-sky-500/10 rounded-3xl p-8 flex items-start gap-4">
              <ExternalLink className="w-6 h-6 text-sky-500 shrink-0 mt-1" />
              <div>
                 <h4 className="font-bold text-white">Note sur les sous-menus</h4>
                 <p className="text-sm text-slate-400 mt-1">Le système supporte actuellement la navigation à un seul niveau pour le menu principal. Les sous-menus seront activés lors d'une prochaine mise à jour.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
