'use client';

import { useState, useEffect } from 'react';
import { 
  Languages, 
  Save, 
  RefreshCw, 
  Search, 
  Globe, 
  Check, 
  Plus, 
  Trash2,
  Settings,
  AlertCircle
} from 'lucide-react';
import { getSettingsAction, updateSettingsAction } from '@/app/actions';

const LOCALES = [
  { id: 'fr', label: 'Français' },
  { id: 'ar', label: 'العربية' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
];

export default function ContentRegistry() {
  const [activeLang, setActiveLang] = useState('fr');
  const [entries, setEntries] = useState<{key: string, value: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await getSettingsAction();
    
    if (data?.dictionaries?.[activeLang]) {
      const dict = data.dictionaries[activeLang];
      const flat = Object.entries(dict).map(([k, v]) => ({ key: k, value: v as string }));
      setEntries(flat);
    } else {
      setEntries([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [activeLang]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const current = await getSettingsAction();
      
      const newDict = { ...current.dictionaries };
      const obj: any = {};
      entries.forEach(e => { if(e.key) obj[e.key] = e.value; });
      newDict[activeLang] = obj;

      await updateSettingsAction({ ...current, dictionaries: newDict });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving registry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-black text-white">Registre de Contenu</h1>
          <p className="text-slate-400 mt-2 font-medium">Gérez les textes statiques et les traductions globales du site.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {LOCALES.map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLang(loc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLang === loc.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {loc.id.toUpperCase()}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
              saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-950 shadow-white/10 hover:scale-105'
            }`}
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3">Informations</h3>
            <div className="flex gap-3 text-slate-400">
               <AlertCircle className="w-5 h-5 text-sky-500 shrink-0" />
               <p className="text-[11px] leading-relaxed">
                 Toute modification ici écrasera les textes par défaut du site pour la langue <b>{activeLang.toUpperCase()}</b>.
                 Utilisez les clés de dictionnaire (ex: <code>hero.title</code>).
               </p>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4">Recherche</h3>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input 
                  type="text" 
                  placeholder="Filtrer les clés..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-sky-500/50 transition-all"
                />
             </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden">
             <div className="p-6 bg-white/5 font-black text-[10px] text-slate-500 uppercase tracking-widest flex justify-between">
                <span>Clé du Dictionnaire</span>
                <span>Texte de Remplacement</span>
             </div>
             
             <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {loading ? (
                   <div className="p-12 text-center text-slate-600 font-bold">Initialisation du registre...</div>
                ) : entries.filter(e => e.key.includes(search)).length === 0 ? (
                  <div className="p-12 text-center text-slate-700">Aucune entrée trouvée.</div>
                ) : entries.filter(e => e.key.includes(search)).map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors group">
                     <div className="w-1/3">
                        <input 
                          type="text" 
                          value={entry.key}
                          onChange={e => {
                            const next = [...entries];
                            next[idx].key = e.target.value;
                            setEntries(next);
                          }}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-sky-400 outline-none focus:border-sky-500/50"
                        />
                     </div>
                     <div className="flex-1">
                        <textarea 
                          value={entry.value}
                          onChange={e => {
                            const next = [...entries];
                            next[idx].value = e.target.value;
                            setEntries(next);
                          }}
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none focus:border-sky-500/50 min-h-[40px] max-h-[200px]"
                          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                        />
                     </div>
                     <button 
                        onClick={() => setEntries(entries.filter((_, i) => i !== idx))}
                        className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ))}
             </div>

             <div className="p-4 bg-white/[0.02] border-t border-white/5">
                <button 
                  onClick={() => setEntries([...entries, {key: '', value: ''}])}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 rounded-xl font-bold text-xs hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une Surcharge
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
