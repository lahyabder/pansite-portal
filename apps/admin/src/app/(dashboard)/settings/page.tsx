'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Globe, Shield, Bell, Database, Save, Check, RefreshCw, Upload, Mail, Phone, MapPin, Share2, Search } from 'lucide-react';
import { getSiteSettingsAction, updateSiteSettingsAction } from '@/app/actions';
import type { SiteSettings } from '@pan/shared';

const SECTIONS = [
    { id: 'general',   label: 'Identité & Contact', icon: <Globe className="w-4 h-4" /> },
    { id: 'social',    label: 'Réseaux Sociaux',    icon: <Share2 className="w-4 h-4" /> },
    { id: 'seo',       label: 'SEO Global',         icon: <Search className="w-4 h-4" /> },
    { id: 'security',  label: 'Sécurité',           icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" /> },
    { id: 'system',    label: 'Système',             icon: <Database className="w-4 h-4" /> },
];

function SectionTitle({ title, icon }: { title: string; icon: string }) {
    return (
        <h2 className="text-base font-bold text-pan-navy mb-4 pb-3 border-b border-pan-gray-100 flex items-center gap-2">
            <span>{icon}</span> {title}
        </h2>
    );
}

function InputField({ label, value, onChange, type = 'text', hint, icon: Icon }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string; icon?: any;
}) {
    return (
        <div className="py-3 border-b border-pan-gray-50 last:border-0">
            <label className="block text-xs font-semibold text-pan-gray-500 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </label>
            <input
                type={type}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
            />
            {hint && <p className="text-xs text-pan-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-pan-gray-50 last:border-0">
            <span className="text-sm text-pan-gray-700">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pan-sky/30 ${checked ? 'bg-pan-sky' : 'bg-pan-gray-200'}`}
            >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // State for site settings
    const [settings, setSettings] = useState<Partial<SiteSettings>>({
        siteName: { fr: '', ar: '', en: '', es: '' },
        slogan: { fr: '', ar: '', en: '', es: '' },
        contactEmails: [],
        contactPhones: [],
        address: { fr: '', ar: '', en: '', es: '' },
        socialLinks: {},
        copyright: { fr: '', ar: '', en: '', es: '' },
        seoGlobal: { titleTemplate: '', defaultDescription: '' }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSiteSettingsAction();
                if (data) setSettings(data);
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSiteSettingsAction(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setSaving(false);
        }
    };

    const updateLocString = (field: keyof SiteSettings, lang: string, val: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: { ...(prev[field] as any), [lang]: val }
        }));
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
                    <h1 className="text-2xl font-bold text-pan-navy">Configuration</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">Gérez l&apos;identité et les paramètres de la plateforme</p>
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

            <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <nav className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden sticky top-24">
                        {SECTIONS.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id)}
                                className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all border-b border-pan-gray-50 last:border-0 ${
                                    activeSection === sec.id ? 'bg-pan-gold text-pan-navy' : 'text-pan-gray-500 hover:bg-pan-gray-50'
                                }`}
                            >
                                {sec.icon} {sec.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-8">
                        {activeSection === 'general' && (
                            <div className="space-y-4">
                                <SectionTitle title="Identité de l'institution" icon="⚓" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Nom du Site (FR)" value={settings.siteName?.fr || ''} onChange={v => updateLocString('siteName', 'fr', v)} />
                                    <InputField label="Nom du Site (AR)" value={settings.siteName?.ar || ''} onChange={v => updateLocString('siteName', 'ar', v)} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Slogan (FR)" value={settings.slogan?.fr || ''} onChange={v => updateLocString('slogan', 'fr', v)} />
                                    <InputField label="Slogan (AR)" value={settings.slogan?.ar || ''} onChange={v => updateLocString('slogan', 'ar', v)} />
                                </div>
                                <SectionTitle title="Contact & Localisation" icon="📍" />
                                <InputField label="Email Principal" value={settings.contactEmails?.[0] || ''} onChange={v => setSettings({...settings, contactEmails: [v]})} icon={Mail} />
                                <InputField label="Téléphone Principal" value={settings.contactPhones?.[0] || ''} onChange={v => setSettings({...settings, contactPhones: [v]})} icon={Phone} />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Adresse (FR)" value={settings.address?.fr || ''} onChange={v => updateLocString('address', 'fr', v)} icon={MapPin} />
                                    <InputField label="Adresse (AR)" value={settings.address?.ar || ''} onChange={v => updateLocString('address', 'ar', v)} icon={MapPin} />
                                </div>
                            </div>
                        )}

                        {activeSection === 'social' && (
                            <div className="space-y-4">
                                <SectionTitle title="Présence Sociale" icon="📱" />
                                <InputField label="Facebook" value={settings.socialLinks?.facebook || ''} onChange={v => setSettings({...settings, socialLinks: {...settings.socialLinks, facebook: v}})} />
                                <InputField label="Twitter / X" value={settings.socialLinks?.twitter || ''} onChange={v => setSettings({...settings, socialLinks: {...settings.socialLinks, twitter: v}})} />
                                <InputField label="LinkedIn" value={settings.socialLinks?.linkedin || ''} onChange={v => setSettings({...settings, socialLinks: {...settings.socialLinks, linkedin: v}})} />
                                <InputField label="YouTube" value={settings.socialLinks?.youtube || ''} onChange={v => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: v}})} />
                            </div>
                        )}

                        {activeSection === 'seo' && (
                            <div className="space-y-4">
                                <SectionTitle title="Référencement (SEO)" icon="🔍" />
                                <InputField label="Template de Titre" value={settings.seoGlobal?.titleTemplate || ''} onChange={v => setSettings({...settings, seoGlobal: {...settings.seoGlobal, titleTemplate: v, defaultDescription: settings.seoGlobal?.defaultDescription || ''}})} hint="Exemple: %s | PAN" />
                                <div className="py-3">
                                    <label className="block text-xs font-semibold text-pan-gray-500 mb-1.5 uppercase tracking-wide">Description par défaut</label>
                                    <textarea 
                                        value={settings.seoGlobal?.defaultDescription || ''} 
                                        onChange={e => setSettings({...settings, seoGlobal: {...settings.seoGlobal, defaultDescription: e.target.value, titleTemplate: settings.seoGlobal?.titleTemplate || ''}})}
                                        className="w-full px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm h-32 focus:outline-none focus:ring-2 focus:ring-pan-sky/20"
                                    />
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="space-y-4">
                                <SectionTitle title="Sécurité" icon="🔒" />
                                <Toggle label="Exiger la double authentification" checked={false} onChange={() => {}} />
                                <Toggle label="Journalisation avancée des accès" checked={true} onChange={() => {}} />
                            </div>
                        )}

                        {activeSection === 'system' && (
                            <div className="space-y-6">
                                <SectionTitle title="Système & Maintenance" icon="⚙️" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-pan-gray-50 rounded-2xl border border-pan-gray-100">
                                        <p className="text-xs font-bold text-pan-gray-400 uppercase mb-2">Version</p>
                                        <p className="text-xl font-bold text-pan-navy">2.1.0-Dynamic</p>
                                    </div>
                                    <div className="p-6 bg-pan-gray-50 rounded-2xl border border-pan-gray-100">
                                        <p className="text-xs font-bold text-pan-gray-400 uppercase mb-2">Database</p>
                                        <p className="text-xl font-bold text-pan-navy">Supabase Live</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-pan-gray-200 rounded-2xl text-pan-gray-400 font-bold hover:border-red-300 hover:text-red-500 transition-all">
                                    Vider le cache système
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}