'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { getSiteSettingsAction, updateSiteSettingsAction } from '@/app/actions';
import { Save, Check, RefreshCw, AlertCircle, Plus, Trash2, Globe } from 'lucide-react';
import type { SiteSettings, Locale } from '@pan/shared';

// Helper to flatten and unflatten objects for easier editing
const flattenObj = (ob: any): Record<string, string> => {
    let result: Record<string, string> = {};
    for (const i in ob) {
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i]) && ob[i] !== null) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                result[i + '.' + j] = temp[j];
            }
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};

const unflattenObj = (ob: Record<string, string>): any => {
    let result: any = {};
    for (const i in ob) {
        const keys = i.split('.');
        keys.reduce((r, val, idx) => {
            return r[val] || (r[val] = (idx === keys.length - 1 ? ob[i] : {}));
        }, result);
    }
    return result;
};

const LOCALES: { id: Locale; label: string }[] = [
    { id: 'fr', label: 'Français' },
    { id: 'ar', label: 'العربية' },
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
];

export default function TranslationsPage() {
    const [settings, setSettings] = useState<Partial<SiteSettings> | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // UI states
    const [activeLocale, setActiveLocale] = useState<Locale>('fr');
    // Using flattened pairs for the active locale: { key: string, value: string }
    const [entries, setEntries] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSiteSettingsAction();
                if (data) {
                    setSettings(data);
                    if (data.dictionaries && data.dictionaries['fr']) {
                        const flat = flattenObj(data.dictionaries['fr']);
                        setEntries(Object.keys(flat).map(k => ({ key: k, value: flat[k] })));
                    } else {
                        // Empty start
                        setEntries([]);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // When locale changes, load entries for that locale
    useEffect(() => {
        if (!settings) return;
        const dicts = settings.dictionaries || {};
        if (dicts[activeLocale]) {
            const flat = flattenObj(dicts[activeLocale]);
            setEntries(Object.keys(flat).map(k => ({ key: k, value: flat[k] })));
        } else {
            // Fill with keys from FR if available, empty values
            const frDict = dicts['fr'] || {};
            const flatFr = flattenObj(frDict);
            setEntries(Object.keys(flatFr).map(k => ({ key: k, value: '' })));
        }
    }, [activeLocale]);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        
        // Re-construct the object from entries array
        const objToSave: Record<string, string> = {};
        entries.forEach(e => {
            if (e.key.trim()) objToSave[e.key.trim()] = e.value;
        });
        
        const unflattened = unflattenObj(objToSave);
        
        const newDicts = {
            ...(settings.dictionaries || {}),
            [activeLocale]: unflattened
        };

        try {
            await updateSiteSettingsAction({ ...settings, dictionaries: newDicts });
            setSettings(prev => prev ? ({ ...prev, dictionaries: newDicts }) : null);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    const addEntry = () => {
        setEntries([...entries, { key: '', value: '' }]);
    };

    const removeEntry = (idx: number) => {
        setEntries(entries.filter((_, i) => i !== idx));
    };

    const updateEntry = (idx: number, field: 'key' | 'value', val: string) => {
        const newEntries = [...entries];
        newEntries[idx][field] = val;
        setEntries(newEntries);
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center text-pan-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Textes et Traductions Globaux</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">Gérez le contenu statique du site manuellement via des clés de dictionnaire</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                        saved ? 'bg-green-500 text-white' : 'bg-pan-navy text-white hover:bg-pan-blue'
                    } disabled:opacity-50`}
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer les modifications'}
                </button>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                <Globe className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                <div className="space-y-2">
                    <h3 className="font-bold text-pan-navy text-sm">Mode Avancé - Surcharge du Dictionnaire</h3>
                    <p className="text-sm text-pan-gray-600 leading-relaxed">
                        Ici vous pouvez surcharger les textes statiques du site (Textes par défaut, labels de formulaires, etc). 
                        Vous devez utiliser la <b>clé exacte</b> du paramètre que vous souhaitez modifier 
                        (ex: <code>hero.title</code> ou <code>pages.infrastructure.title</code>).
                        Si vous ne connaissez pas une clé, laissez l'équipe technique s'en charger.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-pan-gray-100 p-2 bg-pan-gray-50/50">
                    {LOCALES.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => setActiveLocale(loc.id)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                                activeLocale === loc.id ? 'bg-white shadow-sm text-pan-navy ring-1 ring-pan-gray-200' : 'text-pan-gray-500 hover:bg-white/50'
                            }`}
                        >
                            {loc.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    <div className="space-y-3">
                        {entries.length === 0 && (
                            <div className="py-12 text-center border-2 border-dashed border-pan-gray-100 rounded-2xl">
                                <p className="text-pan-gray-400 font-bold mb-4">Aucune traduction personnalisée pour {LOCALES.find(l=>l.id===activeLocale)?.label}</p>
                            </div>
                        )}
                        {entries.map((entry, idx) => (
                            <div key={idx} className="flex items-start gap-3 group">
                                <div className="flex-1 grid grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <input 
                                            type="text" 
                                            placeholder="Ex: nav.home"
                                            value={entry.key}
                                            onChange={e => updateEntry(idx, 'key', e.target.value)}
                                            className="w-full px-3 py-2 border border-pan-gray-200 rounded-lg text-sm font-mono text-pan-sky bg-white"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        {entry.value && entry.value.length > 80 ? (
                                            <textarea 
                                                value={entry.value}
                                                onChange={e => updateEntry(idx, 'value', e.target.value)}
                                                className="w-full px-3 py-2 border border-pan-gray-200 rounded-lg text-sm w-full min-h-[40px] max-h-[200px]"
                                                dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                                                style={{ fontFamily: activeLocale === 'ar' ? 'var(--font-arabic, inherit)' : 'inherit' }}
                                            />
                                        ) : (
                                            <input 
                                                type="text" 
                                                value={entry.value}
                                                onChange={e => updateEntry(idx, 'value', e.target.value)}
                                                placeholder="Texte de remplacement..."
                                                className="w-full px-3 py-2 border border-pan-gray-200 rounded-lg text-sm w-full"
                                                dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                                            />
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeEntry(idx)}
                                    className="p-2 text-pan-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <button 
                            onClick={addEntry}
                            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-pan-gray-200 text-pan-navy font-bold rounded-xl hover:border-pan-navy hover:bg-pan-gray-50 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter une clé personnalisée
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
