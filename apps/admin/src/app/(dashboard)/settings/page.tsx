'use client';

import { useState } from 'react';
import { Globe, Shield, Bell, Database, Save, Check, RefreshCw } from 'lucide-react';

interface SettingsSection {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const SECTIONS: SettingsSection[] = [
    { id: 'general',   label: 'Général',           icon: <Globe className="w-4 h-4" /> },
    { id: 'security',  label: 'Sécurité',          icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'system',    label: 'Système',            icon: <Database className="w-4 h-4" /> },
];

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

function InputField({ label, value, onChange, type = 'text', hint }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string;
}) {
    return (
        <div className="py-3 border-b border-pan-gray-50 last:border-0">
            <label className="block text-xs font-semibold text-pan-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
            />
            {hint && <p className="text-xs text-pan-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="py-3 border-b border-pan-gray-50 last:border-0">
            <label className="block text-xs font-semibold text-pan-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky bg-white transition-all"
            >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [saved, setSaved] = useState(false);

    // General
    const [siteName, setSiteName] = useState('Port Autonome de Nouadhibou');
    const [siteEmail, setSiteEmail] = useState('contact@pan.mr');
    const [defaultLang, setDefaultLang] = useState('fr');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

    // Security
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('8');
    const [ipWhitelist, setIpWhitelist] = useState('');
    const [loginAttempts, setLoginAttempts] = useState('5');

    // Notifications
    const [emailOnPublish, setEmailOnPublish] = useState(true);
    const [emailOnNewMessage, setEmailOnNewMessage] = useState(true);
    const [emailOnUrgent, setEmailOnUrgent] = useState(true);
    const [notifEmail, setNotifEmail] = useState('admin@pan.mr');

    // System
    const [cacheEnabled, setCacheEnabled] = useState(true);
    const [debugMode, setDebugMode] = useState(false);
    const [autoBackup, setAutoBackup] = useState(true);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Paramètres du site</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">Configuration générale de la plateforme</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                        saved
                            ? 'bg-green-500 text-white'
                            : 'bg-pan-navy text-white hover:bg-pan-blue hover:shadow-md'
                    }`}
                >
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Enregistré !' : 'Enregistrer'}
                </button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar nav */}
                <div className="lg:col-span-1">
                    <nav className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                        {SECTIONS.map((sec, i) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveSection(sec.id)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all ${
                                    i > 0 ? 'border-t border-pan-gray-50' : ''
                                } ${
                                    activeSection === sec.id
                                        ? 'bg-pan-navy text-white'
                                        : 'text-pan-gray-700 hover:bg-pan-gray-50'
                                }`}
                            >
                                {sec.icon}
                                {sec.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-6">

                        {activeSection === 'general' && (
                            <div>
                                <h2 className="text-base font-bold text-pan-navy mb-4 pb-3 border-b border-pan-gray-100">
                                    ⚙️ Paramètres Généraux
                                </h2>
                                <InputField label="Nom du site" value={siteName} onChange={setSiteName} />
                                <InputField label="Email de contact" value={siteEmail} onChange={setSiteEmail} type="email" hint="Utilisé pour les réponses automatiques aux formulaires." />
                                <SelectField
                                    label="Langue par défaut"
                                    value={defaultLang}
                                    onChange={setDefaultLang}
                                    options={[
                                        { value: 'fr', label: 'Français' },
                                        { value: 'ar', label: 'العربية' },
                                        { value: 'en', label: 'English' },
                                        { value: 'es', label: 'Español' },
                                    ]}
                                />
                                <Toggle label="Mode maintenance" checked={maintenanceMode} onChange={setMaintenanceMode} />
                                <Toggle label="Activer les analytiques de visite" checked={analyticsEnabled} onChange={setAnalyticsEnabled} />
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div>
                                <h2 className="text-base font-bold text-pan-navy mb-4 pb-3 border-b border-pan-gray-100">
                                    🔒 Paramètres de Sécurité
                                </h2>
                                <Toggle label="Double authentification obligatoire (2FA)" checked={twoFactorRequired} onChange={setTwoFactorRequired} />
                                <SelectField
                                    label="Durée de session (heures)"
                                    value={sessionTimeout}
                                    onChange={setSessionTimeout}
                                    options={[
                                        { value: '1', label: '1 heure' },
                                        { value: '4', label: '4 heures' },
                                        { value: '8', label: '8 heures' },
                                        { value: '24', label: '24 heures' },
                                    ]}
                                />
                                <SelectField
                                    label="Tentatives de connexion avant verrouillage"
                                    value={loginAttempts}
                                    onChange={setLoginAttempts}
                                    options={[
                                        { value: '3', label: '3 tentatives' },
                                        { value: '5', label: '5 tentatives' },
                                        { value: '10', label: '10 tentatives' },
                                    ]}
                                />
                                <InputField
                                    label="IP autorisées (optionnel)"
                                    value={ipWhitelist}
                                    onChange={setIpWhitelist}
                                    hint="Séparez les adresses IP par des virgules. Laissez vide pour autoriser toutes les IPs."
                                />
                                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                                    <strong>Attention :</strong> Si vous activez la restriction IP, assurez-vous que votre IP actuelle est dans la liste avant d&apos;enregistrer.
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div>
                                <h2 className="text-base font-bold text-pan-navy mb-4 pb-3 border-b border-pan-gray-100">
                                    🔔 Notifications par Email
                                </h2>
                                <InputField label="Email de réception des notifications" value={notifEmail} onChange={setNotifEmail} type="email" />
                                <Toggle label="Notifier lors d'une publication de contenu" checked={emailOnPublish} onChange={setEmailOnPublish} />
                                <Toggle label="Notifier lors d'un nouveau message de contact" checked={emailOnNewMessage} onChange={setEmailOnNewMessage} />
                                <Toggle label="Notifier pour les messages urgents" checked={emailOnUrgent} onChange={setEmailOnUrgent} />
                            </div>
                        )}

                        {activeSection === 'system' && (
                            <div>
                                <h2 className="text-base font-bold text-pan-navy mb-4 pb-3 border-b border-pan-gray-100">
                                    🖥️ Paramètres Système
                                </h2>
                                <Toggle label="Activer le cache de contenu" checked={cacheEnabled} onChange={setCacheEnabled} />
                                <Toggle label="Mode débogage (logs détaillés)" checked={debugMode} onChange={setDebugMode} />
                                <Toggle label="Sauvegarde automatique quotidienne" checked={autoBackup} onChange={setAutoBackup} />

                                <div className="mt-6 space-y-3">
                                    <div className="p-4 rounded-xl border border-pan-gray-100 bg-pan-gray-50">
                                        <p className="text-xs font-bold text-pan-gray-500 mb-1 uppercase tracking-wide">Version du système</p>
                                        <p className="text-sm font-semibold text-pan-navy">Back-Office PAN v2.0.0</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-pan-gray-100 bg-pan-gray-50">
                                        <p className="text-xs font-bold text-pan-gray-500 mb-1 uppercase tracking-wide">Environnement</p>
                                        <p className="text-sm font-semibold text-pan-navy capitalize">{process.env.NODE_ENV || 'production'}</p>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-pan-gray-200 rounded-xl text-sm font-medium text-pan-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all">
                                        <RefreshCw className="w-4 h-4" />
                                        Vider le cache
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}