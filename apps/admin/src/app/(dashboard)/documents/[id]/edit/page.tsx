'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getGedDocumentById, updateGedDocument } from '@pan/shared';
import type { DocumentTheme, DocumentDirection, DocumentAccessLevel } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';

const themes: { value: DocumentTheme; label: string }[] = [
    { value: 'reglementation', label: 'Réglementation' },
    { value: 'tarification', label: 'Tarification' },
    { value: 'securite', label: 'Sécurité' },
    { value: 'environnement', label: 'Environnement' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'finance', label: 'Finance' },
    { value: 'autre', label: 'Autre' },
];

const directions: { value: DocumentDirection; label: string }[] = [
    { value: 'direction_generale', label: 'Direction Générale' },
    { value: 'direction_exploitation', label: 'Direction Exploitation' },
    { value: 'direction_commerciale', label: 'Direction Commerciale' },
    { value: 'direction_technique', label: 'Direction Technique' },
    { value: 'direction_financiere', label: 'Direction Financière' },
    { value: 'direction_rh', label: 'Direction RH' },
    { value: 'capitainerie', label: 'Capitainerie' },
    { value: 'securite', label: 'Service Sécurité' },
    { value: 'autre', label: 'Autre' },
];

export default function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { session } = useAuth();
    const doc = getGedDocumentById(id);

    const [titleFr, setTitleFr] = useState(doc?.title.fr || '');
    const [descFr, setDescFr] = useState(doc?.description.fr || '');
    const [reference, setReference] = useState(doc?.reference || '');
    const [theme, setTheme] = useState<DocumentTheme>(doc?.theme || 'reglementation');
    const [direction, setDirection] = useState<DocumentDirection>(doc?.direction || 'direction_generale');
    const [accessLevel, setAccessLevel] = useState<DocumentAccessLevel>(doc?.accessLevel || 'public');
    const [language, setLanguage] = useState<'fr' | 'ar' | 'fr_ar'>(doc?.language || 'fr');
    const [categories, setCategories] = useState(doc?.categories.join(', ') || '');
    const [keywords, setKeywords] = useState(doc?.keywords.join(', ') || '');

    if (!doc) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-admin-text">Document non trouvé</h2>
            </div>
        );
    }

    function handleSave() {
        updateGedDocument(id, {
            title: { fr: titleFr, ar: titleFr, en: titleFr, es: titleFr },
            description: { fr: descFr, ar: descFr, en: descFr, es: descFr },
            reference: reference || undefined,
            theme,
            direction,
            accessLevel,
            language: language as 'fr' | 'ar' | 'fr_ar',
            categories: categories.split(',').map((c) => c.trim()).filter(Boolean),
            keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }, session?.user.id || 'system');
        router.push('/documents');
    }

    const inputClass = 'w-full px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-2 focus:ring-admin-primary/30';
    const labelClass = 'block text-admin-text text-sm font-medium mb-1.5';

    return (
        <RequirePermission module="documents" action="edit">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <button onClick={() => router.push('/documents')} className="text-admin-primary-light text-sm hover:underline mb-2 block">
                        ← Retour aux documents
                    </button>
                    <h2 className="text-xl font-bold text-admin-text">Modifier le document</h2>
                    <p className="text-admin-text-muted text-sm mt-1">
                        {doc.reference && <span className="font-mono">{doc.reference} · </span>}
                        v{doc.currentVersion}
                    </p>
                </div>

                <div className="bg-admin-surface rounded-xl border border-admin-border p-6 space-y-6">
                    {/* Title FR / AR */}
                    <div className="grid md:grid-cols-1 gap-4">
                        <div>
                            <label className={labelClass}>Titre (Français) *</label>
                            <input type="text" value={titleFr} onChange={(e) => setTitleFr(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    {/* Description FR / AR */}
                    <div className="grid md:grid-cols-1 gap-4">
                        <div>
                            <label className={labelClass}>Description (Français)</label>
                            <textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={3} className={inputClass} />
                        </div>
                    </div>

                    {/* Reference + Language */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Référence</label>
                            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Langue</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value as 'fr' | 'ar' | 'fr_ar')} className={inputClass}>
                                <option value="fr">Français</option>
                                <option value="ar">Arabe</option>
                                <option value="fr_ar">Bilingue</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Niveau d&apos;accès</label>
                            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as DocumentAccessLevel)} className={inputClass}>
                                <option value="public">🌐 Public</option>
                                <option value="restricted">🔒 Restreint</option>
                                <option value="internal">🏢 Interne</option>
                            </select>
                        </div>
                    </div>

                    {/* Theme + Direction */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Thème</label>
                            <select value={theme} onChange={(e) => setTheme(e.target.value as DocumentTheme)} className={inputClass}>
                                {themes.map((th) => (
                                    <option key={th.value} value={th.value}>{th.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Direction</label>
                            <select value={direction} onChange={(e) => setDirection(e.target.value as DocumentDirection)} className={inputClass}>
                                {directions.map((d) => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Categories + Keywords */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Catégories</label>
                            <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Mots-clés</label>
                            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                    <button onClick={() => router.push('/documents')} className="px-5 py-2.5 border border-admin-border text-admin-text-muted text-sm rounded-xl hover:bg-admin-surface-alt transition-colors">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                        Enregistrer les modifications
                    </button>
                </div>
            </div>
        </RequirePermission>
    );
}
