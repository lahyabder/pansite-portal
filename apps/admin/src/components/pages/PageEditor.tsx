'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePageAction, createPageAction } from '@/app/actions';
import type { Page, PageBlock, LocalizedString } from '@pan/shared';
import Link from 'next/link';
import { 
  Layout, 
  Grid, 
  Type, 
  MessageSquare, 
  ChevronLeft, 
  Save, 
  RefreshCw, 
  Image as ImageIcon, 
  Globe, 
  Plus, 
  GripVertical, 
  Settings, 
  Trash2 
} from 'lucide-react';
import { AutoJsonEditor } from './AutoJsonEditor';

interface PageEditorProps {
  initialData?: any;
  id?: string;
}

const BLOCK_TYPES = [
  { type: 'hero',     label: 'Hero Slider',    icon: Layout,      desc: 'Carrousel premium avec titres et images' },
  { type: 'stats',    label: 'Grille Chiffres', icon: Grid,        desc: 'Statistiques clés de l\'activité (Home)' },
  { type: 'quick_services', label: 'Services Rapides', icon: Grid, desc: 'Grille d\'icônes de services interactifs' },
  { type: 'latest_news', label: 'Flux d\'Actualités', icon: Layout, desc: 'Affiche dynamiquement les actus' },
  { type: 'rich_text', label: 'Texte Riche',     icon: Type,        desc: 'Éditeur de texte avec formatage' },
  { type: 'features', label: 'Atouts / Features', icon: Grid,        desc: 'Grille d\'icônes et descriptions' },
  { type: 'cta',      label: 'Appel à l\'Action', icon: MessageSquare, desc: 'Bouton et texte d\'action' },
];

const LOCALES = [
  { id: 'fr', label: 'Français' },
  { id: 'ar', label: 'العربية' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
];

export default function PageEditor({ initialData, id }: PageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState<any>(initialData || {
    title: { fr: '', ar: '', en: '', es: '' },
    slug: '',
    status: 'draft',
    blocks: [],
    content: {},
    hero: { title: { fr: '' } }
  });
  
  const isCmsFormPage = page.content && Object.keys(page.content).length > 0;
  
  const [activeLang, setActiveLang] = useState('fr');
  const [saving, setSaving] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

  const addBlock = (type: string) => {
    const newBlock: any = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: {},
      order: page.blocks.length,
      isActive: true
    };
    setPage({ ...page, blocks: [...page.blocks, newBlock] });
    setActiveBlockIndex(page.blocks.length);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await updatePageAction(id, page);
      } else {
        await createPageAction(page);
      }
      router.push('/pages');
    } catch (err: any) {
      alert('Erreur lors de l\'enregistrement : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] -m-8">
      {/* ─── Editor Header ─── */}
      <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/pages" className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-[1px] bg-white/5"></div>
          <div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={page.title?.[activeLang] || ''} 
                onChange={e => setPage({ ...page, title: { ...page.title, [activeLang]: e.target.value } })}
                placeholder="Nom de la page..."
                className="bg-transparent border-none outline-none font-outfit text-xl font-black text-white placeholder:text-slate-700 min-w-[300px]"
              />
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-black text-slate-500 border border-white/5 uppercase">/{page.slug || 'slug'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
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
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Enregistrement...' : 'Publier les Modifications'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {isCmsFormPage ? (
          <main className="flex-1 bg-slate-950/50 p-12 overflow-y-auto">
             <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
                 <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                   <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center">
                     <Layout className="w-6 h-6 text-sky-500" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-white">Éditeur de Page Structurée</h2>
                     <p className="text-slate-500 text-sm mt-1">Modifiez directement les textes et images des sections fixes.</p>
                   </div>
                 </div>
                 <AutoJsonEditor 
                   label="Sections de la page" 
                   value={page.content} 
                   onChange={(val: any) => setPage({ ...page, content: val })} 
                   activeLang={activeLang}
                   depth={0} 
                 />
               </div>
             </div>
          </main>
        ) : (
          <>
        {/* ─── Block Library ─── */}
        <aside className="w-80 border-r border-white/5 p-6 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Ressources</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group">
                <ImageIcon className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-400">Médiathèque</span>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group text-emerald-400">
                <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-400">SEO</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Ajouter des Blocs</h3>
            <div className="space-y-3">
              {BLOCK_TYPES.map(block => (
                <button
                  key={block.type}
                  onClick={() => addBlock(block.type)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-sky-500/50 transition-colors">
                    <block.icon className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{block.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{block.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── Visual Canvas ─── */}
        <main className="flex-1 bg-slate-950/50 p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {page.blocks.length === 0 && (
              <div className="aspect-video border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 animate-pulse">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                  <Plus className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-600">Votre page est vide</h3>
                <p className="text-sm text-slate-700 mt-2">Commencez à ajouter des blocs depuis la barre latérale pour la construire.</p>
              </div>
            )}

            {page.blocks.map((block: any, idx: number) => (
              <div 
                key={block.id} 
                className={`relative group bg-slate-900 border transition-all rounded-3xl overflow-hidden ${
                  activeBlockIndex === idx ? 'border-sky-500 shadow-2xl shadow-sky-500/10' : 'border-white/5'
                }`}
                onMouseEnter={() => setActiveBlockIndex(idx)}
              >
                {/* Block Controls */}
                <div className={`absolute top-4 right-4 flex items-center gap-2 transition-opacity z-20 ${
                  activeBlockIndex === idx ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      const newBlocks = [...page.blocks];
                      newBlocks.splice(idx, 1);
                      setPage({ ...page, blocks: newBlocks });
                    }}
                    className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-8">
                   <div className="flex items-center gap-3 mb-6">
                     <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 uppercase tracking-widest">{block.type}</span>
                   </div>
                   
                   {/* Conditional inputs based on type */}
                   {block.type === 'hero' && (
                     <div className="space-y-6">
                        {(block.content.slides || [{}]).map((slide: any, sIdx: number) => (
                           <div key={sIdx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slide #{sIdx + 1}</span>
                                 {(block.content.slides?.length > 1) && (
                                   <button onClick={() => {
                                      const next = [...page.blocks];
                                      next[idx].content.slides = next[idx].content.slides.filter((_:any,i:any)=>i!==sIdx);
                                      setPage({...page, blocks: next});
                                   }} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                                 )}
                              </div>
                              <textarea 
                                value={slide.title?.[activeLang] || ''}
                                onChange={e => {
                                  const next = [...page.blocks];
                                  if (!next[idx].content.slides) next[idx].content.slides = [{}];
                                  next[idx].content.slides[sIdx].title = { ...next[idx].content.slides[sIdx].title, [activeLang]: e.target.value };
                                  setPage({ ...page, blocks: next });
                                }}
                                placeholder="Titre de la slide..."
                                className="w-full bg-transparent border-none outline-none text-2xl font-black text-white placeholder:text-slate-800 resize-none h-12"
                              />
                              <input 
                                type="text"
                                value={slide.image || ''}
                                onChange={e => {
                                  const next = [...page.blocks];
                                  if (!next[idx].content.slides) next[idx].content.slides = [{}];
                                  next[idx].content.slides[sIdx].image = e.target.value;
                                  setPage({ ...page, blocks: next });
                                }}
                                placeholder="Image URL..."
                                className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2 text-xs text-slate-400 outline-none"
                              />
                           </div>
                        ))}
                        <button 
                           onClick={() => {
                              const next = [...page.blocks];
                              if (!next[idx].content.slides) next[idx].content.slides = [{}];
                              next[idx].content.slides.push({ title: { fr: '' }, subtitle: { fr: '' }, image: '' });
                              setPage({...page, blocks: next});
                           }}
                           className="w-full py-3 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest"
                        >
                           <Plus className="w-3 h-3 mx-auto mb-1" />
                           Ajouter une Slide
                        </button>
                     </div>
                   )}

                   {block.type === 'stats' && (
                     <div className="grid grid-cols-2 gap-4">
                        {(block.content.items || []).map((stat: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 relative group">
                             <button onClick={() => {
                                const next = [...page.blocks];
                                next[idx].content.items = next[idx].content.items.filter((_:any,i:any)=>i!==sIdx);
                                setPage({...page, blocks: next});
                             }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><Trash2 className="w-3 h-3" /></button>
                             <div className="grid grid-cols-2 gap-2">
                                <input value={stat.value || ''} placeholder="Val (ex: 1.2M)" onChange={e => {
                                   const next = [...page.blocks];
                                   if (!next[idx].content.items) next[idx].content.items = [];
                                   next[idx].content.items[sIdx].value = e.target.value;
                                   setPage({...page, blocks: next});
                                }} className="bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1 text-xs text-sky-400 font-bold" />
                                <input value={stat.unit || ''} placeholder="Unit (ex: T)" onChange={e => {
                                   const next = [...page.blocks];
                                   if (!next[idx].content.items) next[idx].content.items = [];
                                   next[idx].content.items[sIdx].unit = e.target.value;
                                   setPage({...page, blocks: next});
                                }} className="bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1 text-xs text-slate-500" />
                             </div>
                             <input value={stat.label?.[activeLang] || ''} placeholder="Libellé..." onChange={e => {
                                const next = [...page.blocks];
                                if (!next[idx].content.items) next[idx].content.items = [];
                                next[idx].content.items[sIdx].label = { ...next[idx].content.items[sIdx].label, [activeLang]: e.target.value };
                                setPage({...page, blocks: next});
                             }} className="w-full bg-transparent border-none text-[10px] font-black text-white uppercase tracking-widest outline-none" />
                          </div>
                        ))}
                        <button onClick={() => {
                            const next = [...page.blocks];
                            if (!next[idx].content.items) next[idx].content.items = [];
                            next[idx].content.items.push({ value: '', unit: '', label: { fr: '' } });
                            setPage({...page, blocks: next});
                        }} className="col-span-2 py-4 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-700 hover:text-slate-400 transition-colors">
                           <Plus className="w-5 h-5" />
                        </button>
                     </div>
                   )}

                   {block.type === 'quick_services' && (
                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <input value={block.content.subtitle?.[activeLang] || ''} placeholder="Surtitre (ex: Portail Services)" onChange={e => {
                              const next = [...page.blocks];
                              if (!next[idx].content) next[idx].content = {};
                              next[idx].content.subtitle = { ...next[idx].content.subtitle, [activeLang]: e.target.value };
                              setPage({...page, blocks: next});
                           }} className="bg-slate-950/50 outline-none border border-white/5 rounded-xl px-4 py-2 text-xs text-sky-400" />
                           <input value={block.content.title?.[activeLang] || ''} placeholder="Grand Titre (ex: Accès Rapide)" onChange={e => {
                              const next = [...page.blocks];
                              if (!next[idx].content) next[idx].content = {};
                              next[idx].content.title = { ...next[idx].content.title, [activeLang]: e.target.value };
                              setPage({...page, blocks: next});
                           }} className="bg-slate-950/50 outline-none border border-white/5 rounded-xl px-4 py-2 text-xs text-white uppercase" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           {(block.content.items || []).map((srv: any, sIdx: number) => (
                              <div key={sIdx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 relative group">
                                 <button onClick={() => {
                                    const next = [...page.blocks];
                                    next[idx].content.items = next[idx].content.items.filter((_:any,i:any)=>i!==sIdx);
                                    setPage({...page, blocks: next});
                                 }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><Trash2 className="w-3 h-3" /></button>
                                 <input value={srv.icon || ''} placeholder="Icone (ex: Ship, Anchor, Phone)" onChange={e => {
                                    const next = [...page.blocks];
                                    if (!next[idx].content.items) next[idx].content.items = [];
                                    next[idx].content.items[sIdx].icon = e.target.value;
                                    setPage({...page, blocks: next});
                                 }} className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-2 text-xs text-sky-400 font-bold" />
                                 <input value={srv.title?.[activeLang] || ''} placeholder="Libellé du Service..." onChange={e => {
                                    const next = [...page.blocks];
                                    if (!next[idx].content.items) next[idx].content.items = [];
                                    next[idx].content.items[sIdx].title = { ...next[idx].content.items[sIdx].title, [activeLang]: e.target.value };
                                    setPage({...page, blocks: next});
                                 }} className="w-full bg-transparent border-none text-xs font-black text-white outline-none" />
                                 <input value={srv.href || ''} placeholder="Lien (/services)" onChange={e => {
                                    const next = [...page.blocks];
                                    if (!next[idx].content.items) next[idx].content.items = [];
                                    next[idx].content.items[sIdx].href = e.target.value;
                                    setPage({...page, blocks: next});
                                 }} className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-2 text-[10px] text-slate-400" />
                              </div>
                           ))}
                           <button onClick={() => {
                               const next = [...page.blocks];
                               if (!next[idx].content.items) next[idx].content.items = [];
                               next[idx].content.items.push({ icon: 'Ship', title: { fr: '' }, href: '/' });
                               setPage({...page, blocks: next});
                           }} className="py-4 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-700 hover:text-slate-400 transition-colors">
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                   )}

                   {block.type === 'latest_news' && (
                     <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">Titre Surligné (ex: Actualités & Presse)</label>
                           <input 
                             value={block.content.subtitle?.[activeLang] || ''}
                             onChange={e => {
                                const next = [...page.blocks];
                                if (!next[idx].content) next[idx].content = {};
                                next[idx].content.subtitle = { ...next[idx].content.subtitle, [activeLang]: e.target.value };
                                setPage({ ...page, blocks: next });
                             }}
                             className="w-full bg-slate-950/50 outline-none border border-white/5 rounded-xl px-4 py-2 text-sm text-sky-400"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">Grand Titre</label>
                           <input 
                             value={block.content.title?.[activeLang] || ''}
                             onChange={e => {
                                const next = [...page.blocks];
                                if (!next[idx].content) next[idx].content = {};
                                next[idx].content.title = { ...next[idx].content.title, [activeLang]: e.target.value };
                                setPage({ ...page, blocks: next });
                             }}
                             className="w-full bg-slate-950/50 outline-none border border-white/5 rounded-xl px-4 py-2 text-sm text-white"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase">Description (Optionnelle)</label>
                           <textarea 
                             value={block.content.description?.[activeLang] || ''}
                             onChange={e => {
                                const next = [...page.blocks];
                                if (!next[idx].content) next[idx].content = {};
                                next[idx].content.description = { ...next[idx].content.description, [activeLang]: e.target.value };
                                setPage({ ...page, blocks: next });
                             }}
                             className="w-full bg-slate-950/50 outline-none border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-400 h-20"
                           />
                        </div>
                     </div>
                   )}

                   {block.type === 'rich_text' && (
                     <div className="space-y-4">
                        <textarea 
                          value={block.content.text?.[activeLang] || ''}
                          onChange={e => {
                            const next = [...page.blocks];
                            next[idx].content.text = { ...next[idx].content.text, [activeLang]: e.target.value };
                            setPage({ ...page, blocks: next });
                          }}
                          placeholder="Commencez à écrire..."
                          className="w-full bg-transparent border-none outline-none text-lg text-slate-400 placeholder:text-slate-800 min-h-[200px] resize-y"
                        />
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </main>
        </>
        )}
      </div>
    </div>
  );
}

