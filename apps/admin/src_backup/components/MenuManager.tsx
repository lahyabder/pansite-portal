'use client';

import { useState, useEffect } from 'react';
import { getAllMenusAction, upsertMenuAction, getAllPagesAction } from '@/app/actions';
import { 
    Save, Plus, GripVertical, Trash2, 
    Pencil, ChevronRight, ChevronDown, 
    Link as LinkIcon, ExternalLink, RefreshCw,
    Check, X, Globe, Map
} from 'lucide-react';
import type { Menu, NavItem, LocalizedString } from '@pan/shared';

const LOCATIONS = [
    { id: 'main',       label: 'Menu Principal' },
    { id: 'footer',     label: 'Menu Bas de Page' },
    { id: 'header_top', label: 'Menu Haut de Barre' },
];

export default function MenuManager() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [activeLocation, setActiveLocation] = useState('main');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // Current menu state
    const [currentItems, setCurrentItems] = useState<NavItem[]>([]);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    useEffect(() => {
        loadMenus();
    }, []);

    useEffect(() => {
        const menu = menus.find(m => m.location === activeLocation);
        setCurrentItems(menu?.items || []);
    }, [activeLocation, menus]);

    const loadMenus = async () => {
        setLoading(true);
        try {
            const data = await getAllMenusAction();
            setMenus(data || []);
        } catch (err) {
            console.error('Failed to load menus:', err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        const newItem: NavItem = {
            id: Math.random().toString(36).substr(2, 9),
            label: { fr: 'Nouveau Lien', ar: 'رابط جديد', en: '', es: '' },
            href: '/',
            order: currentItems.length,
            children: []
        };
        setCurrentItems([...currentItems, newItem]);
        setEditingItemId(newItem.id!);
    };

    const removeItem = (id: string) => {
        setCurrentItems(currentItems.filter((item: any) => item.id !== id));
    };

    const updateItem = (id: string, updates: Partial<NavItem>) => {
        setCurrentItems(currentItems.map((item: any) => item.id === id ? { ...item, ...updates } : item));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await upsertMenuAction({
                location: activeLocation as any,
                name: LOCATIONS.find(l => l.id === activeLocation)?.label || '',
                items: currentItems
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Navigation</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">Gérez la structure des menus du site</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        saved ? 'bg-green-500 text-white' : 'bg-pan-navy text-white hover:bg-pan-blue'
                    } disabled:opacity-50`}
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
                </button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-pan-gray-100 p-6 space-y-4">
                        <label className="text-[10px] font-bold text-pan-gray-300 uppercase tracking-widest block">Emplacement</label>
                        <div className="space-y-1">
                            {LOCATIONS.map(loc => (
                                <button
                                    key={loc.id}
                                    onClick={() => setActiveLocation(loc.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                        activeLocation === loc.id ? 'bg-pan-navy text-white' : 'text-pan-gray-500 hover:bg-pan-gray-50'
                                    }`}
                                >
                                    {loc.label}
                                    {activeLocation === loc.id && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-pan-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-pan-gray-50">
                            <h2 className="text-lg font-bold text-pan-navy flex items-center gap-2">
                                <Map className="w-5 h-5 opacity-30" />
                                {LOCATIONS.find(l => l.id === activeLocation)?.label}
                            </h2>
                            <button 
                                onClick={addItem}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pan-gray-50 text-pan-navy rounded-xl text-xs font-bold hover:bg-pan-gold transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter un lien
                            </button>
                        </div>

                        <div className="space-y-3">
                            {currentItems.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-pan-gray-50 rounded-3xl">
                                    <p className="text-pan-gray-300 font-bold uppercase tracking-widest text-xs">Menu vide</p>
                                </div>
                            ) : (
                                currentItems.map((item, index) => (
                                    <div key={item.id} className="group">
                                        <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${editingItemId === item.id ? 'border-pan-sky bg-pan-sky/5' : 'border-pan-gray-50 hover:border-pan-gray-200'}`}>
                                            <div className="cursor-grab active:cursor-grabbing text-pan-gray-300 hover:text-pan-navy">
                                                <GripVertical className="w-5 h-5" />
                                            </div>
                                            
                                            <div className="flex-1 grid grid-cols-2 gap-4">
                                                {editingItemId === item.id ? (
                                                    <>
                                                        <div className="space-y-2">
                                                            <div dir="ltr">
                                                                <input 
                                                                    placeholder="Label (FR)" 
                                                                    className="w-full bg-white border border-pan-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                                                                    value={item.label.fr}
                                                                    onChange={e => updateItem(item.id!, { label: { ...item.label, fr: e.target.value } })}
                                                                />
                                                            </div>
                                                            <div dir="rtl">
                                                                <input 
                                                                    placeholder="العنوان (AR)" 
                                                                    className="w-full bg-white border border-pan-gray-200 rounded-lg px-3 py-1.5 text-xs font-arabic"
                                                                    value={item.label.ar}
                                                                    onChange={e => updateItem(item.id!, { label: { ...item.label, ar: e.target.value } })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                placeholder="URL (/page or https://...)" 
                                                                className="flex-1 bg-white border border-pan-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                                                                value={item.href}
                                                                onChange={e => updateItem(item.id!, { href: e.target.value })}
                                                            />
                                                            <button onClick={() => setEditingItemId(null)} className="p-2 bg-pan-navy text-white rounded-lg"><Check className="w-4 h-4" /></button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-pan-navy">{item.label.fr}</span>
                                                            <span className="text-[10px] text-pan-gray-300 font-arabic" dir="rtl">{item.label.ar}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] bg-pan-gray-100 px-2 py-1 rounded text-pan-gray-500 font-mono">{item.href}</span>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => setEditingItemId(item.id!)} className="p-1.5 text-pan-gray-400 hover:text-pan-sky transition-colors"><Pencil className="w-4 h-4" /></button>
                                                                <button onClick={() => removeItem(item.id!)} className="p-1.5 text-pan-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
