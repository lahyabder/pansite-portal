'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ChevronLeft, 
  Plus, 
  GripVertical, 
  Trash2, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Grid, 
  MessageSquare, 
  Settings,
  Eye,
  Globe,
  Check,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { updatePageAction, createPageAction } from '@/app/actions';
import type { Page, PageBlock, LocalizedString } from '@pan/shared';

interface PageEditorProps {
  initialData?: any;
  id?: string;
}

const BLOCK_TYPES = [
  { type: 'hero',     label: 'Section Hero',    icon: Layout,      desc: 'En-tête premium avec image et titre' },
  { type: 'rich_text', label: 'Texte Riche',     icon: Type,        desc: 'Éditeur de texte avec formatage' },
  { type: 'features', label: 'Atouts / Features', icon: Grid,        desc: 'Grille d\'icônes et descriptions' },
  { type: 'cta',      label: 'Appel à l\'Action', icon: MessageSquare, desc: 'Bouton et texte d\'action' },
  { type: 'gallery',  label: 'Galerie Photos',   icon: ImageIcon,   desc: 'Grille d\'images responsive' },
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
    hero: { title: { fr: '' } }
  });
  
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
      alert('Save failed: ' + err.message);
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
            {saving ? 'Saving...' : 'Publish Changes'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* ─── Block Library ─── */}
        <aside className="w-80 border-r border-white/5 p-6 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Site Assets</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group">
                <ImageIcon className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-400">Library</span>
              </div>
              <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors group text-emerald-400">
                <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-400">SEO</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Add Blocks</h3>
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
                <h3 className="text-xl font-bold text-slate-600">Your canvas is empty</h3>
                <p className="text-sm text-slate-700 mt-2">Start adding blocks from the sidebar to build your page.</p>
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
                        <textarea 
                          value={block.content.title?.[activeLang] || ''}
                          onChange={e => {
                            const newBlocks = [...page.blocks];
                            newBlocks[idx].content.title = { ...newBlocks[idx].content.title, [activeLang]: e.target.value };
                            setPage({ ...page, blocks: newBlocks });
                          }}
                          placeholder="Headline text..."
                          className="w-full bg-transparent border-none outline-none text-4xl font-black text-white placeholder:text-slate-800 resize-none"
                        />
                        <input 
                          type="text"
                          value={block.content.image || ''}
                          placeholder="Image URL..."
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-slate-400 outline-none focus:border-white/10"
                        />
                     </div>
                   )}

                   {block.type === 'rich_text' && (
                     <div className="space-y-4">
                        <textarea 
                          value={block.content.text?.[activeLang] || ''}
                          onChange={e => {
                            const newBlocks = [...page.blocks];
                            newBlocks[idx].content.text = { ...newBlocks[idx].content.text, [activeLang]: e.target.value };
                            setPage({ ...page, blocks: newBlocks });
                          }}
                          placeholder="Start writing..."
                          className="w-full bg-transparent border-none outline-none text-lg text-slate-400 placeholder:text-slate-800 min-h-[200px] resize-y"
                        />
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function Link({ href, children, ...props }: any) {
  return <a href={href} {...props}>{children}</a>;
}
