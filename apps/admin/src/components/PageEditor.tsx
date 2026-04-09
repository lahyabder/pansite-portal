'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Save, X, Plus, GripVertical, Trash2, 
    Settings, Layout, Type, Image as ImageIcon, 
    Grid, MessageSquare, List, ArrowDown, ArrowUp,
    ChevronDown, ChevronUp, Check, Globe, Search
} from 'lucide-react';
import type { Page, PageBlock, LocalizedString } from '@pan/shared';
import { updatePageAction, createPageAction, getPageBySlugAction } from '@/app/actions';

interface PageEditorProps {
    initialData?: Partial<Page>;
    id?: string;
}

const BLOCK_TYPES = [
    { type: 'hero',     label: 'Hero Section',    icon: Layout,      desc: 'En-tête de page avec image et titre' },
    { type: 'text',     label: 'Texte Libre',     icon: Type,        desc: 'Éditeur de texte riche multilingue' },
    { type: 'features', label: 'Grille Atouts',   icon: Grid,        desc: 'Liste d\'icônes avec descriptions' },
    { type: 'gallery',  label: 'Galerie Images',  icon: ImageIcon,   desc: 'Grille d\'images avec légendes' },
    { type: 'cta',      label: 'Bouton d\'Action', icon: MessageSquare, desc: 'Bouton d\'appel à l\'action' },
    { type: 'faq',      label: 'Accordéon FAQ',   icon: List,        desc: 'Questions / Réponses' },
];

export default function PageEditor({ initialData, id }: PageEditorProps) {
    const router = useRouter();
    const [page, setPage] = useState<Partial<Page>>(initialData || {
        title: { fr: '', ar: '', en: '', es: '' },
        slug: '',
        status: 'draft',
        blocks: [],
        seo: { title: { fr: '', ar: '', en: '', es: '' }, description: { fr: '', ar: '', en: '', es: '' } }
    });
    
    const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

    const addBlock = (type: string) => {
        const newBlock: PageBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type: type as any,
            content: {},
            order: page.blocks?.length || 0,
            isVisible: true
        };
        setPage(prev => ({ ...prev, blocks: [...(prev.blocks || []), newBlock] }));
        setActiveBlockIndex((page.blocks?.length || 0));
    };

    const removeBlock = (index: number) => {
        const newBlocks = [...(page.blocks || [])];
        newBlocks.splice(index, 1);
        setPage(prev => ({ ...prev, blocks: newBlocks }));
        if (activeBlockIndex === index) setActiveBlockIndex(null);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...(page.blocks || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setPage(prev => ({ ...prev, blocks: newBlocks }));
        setActiveBlockIndex(targetIndex);
    };

    const updateBlockContent = (index: number, content: any) => {
        const newBlocks = [...(page.blocks || [])];
        newBlocks[index].content = { ...newBlocks[index].content, ...content };
        setPage(prev => ({ ...prev, blocks: newBlocks }));
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
        } catch (err) {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const updateLocString = (field: 'title' | 'description', lang: string, val: string) => {
        setPage(prev => ({
            ...prev,
            [field]: { ...(prev[field] as any), [lang]: val }
        }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] -m-8">
            {/* Editor Header */}
            <div className="bg-white border-b border-pan-gray-100 px-8 py-4 flex items-center justify-between z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-pan-gray-50 rounded-lg">
                        <X className="w-5 h-5 text-pan-gray-400" />
                    </button>
                    <div>
                        <input 
                            value={page.title?.fr || ''} 
                            onChange={e => updateLocString('title', 'fr', e.target.value)}
                            placeholder="Titre de la page..."
                            className="text-lg font-bold text-pan-navy focus:outline-none bg-transparent"
                        />
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-pan-gray-300 uppercase letter-spacing-wide">URL:</span>
                            <input 
                                value={page.slug || ''} 
                                onChange={e => setPage({...page, slug: e.target.value})}
                                placeholder="slug-de-page"
                                className="text-[10px] font-semibold text-pan-sky focus:outline-none bg-transparent w-40"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-pan-gray-50 rounded-xl p-1 mr-4">
                        <button 
                            onClick={() => setActiveTab('content')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-white text-pan-navy shadow-sm' : 'text-pan-gray-400'}`}
                        >
                            Contenu
                        </button>
                        <button 
                            onClick={() => setActiveTab('seo')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'seo' ? 'bg-white text-pan-navy shadow-sm' : 'text-pan-gray-400'}`}
                        >
                            SEO
                        </button>
                    </div>
                    
                    <select 
                        value={page.status}
                        onChange={e => setPage({...page, status: e.target.value as any})}
                        className="bg-pan-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-pan-sky/20"
                    >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                    </select>

                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-pan-navy text-white rounded-xl font-bold text-sm hover:bg-pan-blue transition-all disabled:opacity-50 shadow-lg shadow-pan-navy/20"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sauvegarder
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Component Library */}
                <div className="w-72 bg-white border-r border-pan-gray-100 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-[10px] font-bold text-pan-gray-300 uppercase tracking-[0.2em] mb-4">Bibliothèque de Blocs</h3>
                        <div className="space-y-2">
                            {BLOCK_TYPES.map(block => (
                                <button 
                                    key={block.type}
                                    onClick={() => addBlock(block.type)}
                                    className="w-full flex items-start gap-3 p-3 rounded-xl border border-pan-gray-50 hover:border-pan-sky hover:bg-pan-sky/5 transition-all text-left group"
                                >
                                    <div className="w-10 h-10 bg-pan-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <block.icon className="w-5 h-5 text-pan-gray-400 group-hover:text-pan-sky" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-pan-navy">{block.label}</div>
                                        <div className="text-[10px] text-pan-gray-400 mt-0.5 leading-relaxed">{block.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: Canvas / Stage */}
                <div className="flex-1 bg-pan-gray-50 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto space-y-4 min-h-[500px]">
                        {page.blocks?.length === 0 ? (
                            <div className="border-4 border-dashed border-pan-gray-200 rounded-3xl p-20 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-20 h-20 bg-pan-gray-100 rounded-full flex items-center justify-center text-3xl">🧩</div>
                                <div>
                                    <p className="font-bold text-pan-navy">Votre page est vide</p>
                                    <p className="text-sm text-pan-gray-400 mt-1">Ajoutez un bloc depuis la bibliothèque à gauche pour commencer.</p>
                                </div>
                            </div>
                        ) : (
                            page.blocks?.map((block, index) => (
                                <div 
                                    key={block.id}
                                    onClick={() => setActiveBlockIndex(index)}
                                    className={`group relative bg-white rounded-2xl border-2 transition-all p-8 ${activeBlockIndex === index ? 'border-pan-sky shadow-xl scale-[1.02] z-10' : 'border-white hover:border-pan-gray-200 shadow-sm'}`}
                                >
                                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'up');}} className="p-1 px-2 bg-white rounded-lg shadow-sm text-pan-gray-400 hover:text-pan-navy hover:shadow-md">
                                            <ArrowUp className="w-4 h-4" />
                                        </button>
                                        <button onClick={(e) => {e.stopPropagation(); moveBlock(index, 'down');}} className="p-1 px-2 bg-white rounded-lg shadow-sm text-pan-gray-400 hover:text-pan-navy hover:shadow-md">
                                            <ArrowDown className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-pan-navy/5 text-pan-navy rounded-lg">
                                                {BLOCK_TYPES.find(b => b.type === block.type)?.icon && 
                                                    (() => {
                                                        const Icon = BLOCK_TYPES.find(b => b.type === block.type)!.icon;
                                                        return <Icon className="w-4 h-4" />;
                                                    })()
                                                }
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-pan-gray-400">Bloc: {block.type}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => {e.stopPropagation(); removeBlock(index);}}
                                            className="p-2 text-pan-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Simplified Block Content Preview / Input Overlay */}
                                    <div className="space-y-4">
                                        {block.type === 'hero' && (
                                            <div className="bg-pan-navy/90 p-10 rounded-2xl text-white text-center">
                                                <h4 className="text-xl font-bold opacity-50 italic">Preview: Hero Section</h4>
                                                <input 
                                                    className="w-full bg-transparent border-none text-2xl font-bold text-center mt-4 focus:ring-0 placeholder:text-white/20"
                                                    value={block.content.title?.fr || ''}
                                                    onChange={e => updateBlockContent(index, { title: { ...block.content.title, fr: e.target.value } })}
                                                    placeholder="Titre Principal..."
                                                />
                                            </div>
                                        )}
                                        {block.type === 'text' && (
                                            <textarea 
                                                className="w-full bg-transparent border-none text-sm text-pan-gray-600 focus:ring-0 min-h-[100px]"
                                                value={block.content.body?.fr || ''}
                                                onChange={e => updateBlockContent(index, { body: { ...block.content.body, fr: e.target.value } })}
                                                placeholder="Saisissez votre contenu texte ici..."
                                            />
                                        )}
                                        {block.type !== 'hero' && block.type !== 'text' && (
                                            <div className="py-10 text-center border-2 border-dashed border-pan-gray-100 rounded-2xl text-pan-gray-300 font-bold uppercase text-[10px] tracking-widest">
                                                Configuration: {block.type}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Inspector / Properties */}
                <div className="w-80 bg-white border-l border-pan-gray-100 overflow-y-auto p-6">
                    {activeBlockIndex !== null ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <h3 className="text-[10px] font-bold text-pan-gray-300 uppercase tracking-[0.2em]">Propriétés du Bloc</h3>
                            
                            <div className="space-y-4">
                                {/* Configuration according to block type */}
                                <div>
                                    <label className="text-[10px] font-bold text-pan-gray-400 uppercase mb-2 block">Titre (Arabe)</label>
                                    <input 
                                        dir="rtl"
                                        className="w-full bg-pan-gray-50 border border-pan-gray-100 rounded-xl px-4 py-2.5 text-sm font-arabic"
                                        value={page.blocks![activeBlockIndex].content.title?.ar || ''}
                                        onChange={e => updateBlockContent(activeBlockIndex, { title: { ...page.blocks![activeBlockIndex].content.title, ar: e.target.value } })}
                                    />
                                </div>

                                {page.blocks![activeBlockIndex].type === 'hero' && (
                                    <div>
                                        <label className="text-[10px] font-bold text-pan-gray-400 uppercase mb-2 block">Image de fond (URL)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                className="flex-1 bg-pan-gray-50 border border-pan-gray-100 rounded-xl px-4 py-2.5 text-[10px]"
                                                value={page.blocks![activeBlockIndex].content.bgImage || ''}
                                                onChange={e => updateBlockContent(activeBlockIndex, { bgImage: e.target.value })}
                                            />
                                            <button className="p-2.5 bg-pan-navy text-white rounded-xl"><ImageIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-pan-gray-300 p-6">
                            <Settings className="w-10 h-10 mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-wider">Sélectionnez un bloc pour le configurer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
