'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGedDocument } from '@pan/shared';
import type { DocumentFileType, DocumentTheme, DocumentDirection, DocumentAccessLevel, DocumentStatus } from '@pan/shared';
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

const fileTypes: { value: DocumentFileType; label: string }[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word (doc)' },
    { value: 'docx', label: 'Word (docx)' },
    { value: 'xlsx', label: 'Excel (xlsx)' },
    { value: 'xls', label: 'Excel (xls)' },
    { value: 'ppt', label: 'PowerPoint (ppt)' },
    { value: 'pptx', label: 'PowerPoint (pptx)' },
    { value: 'jpg', label: 'Image (jpg)' },
    { value: 'png', label: 'Image (png)' },
    { value: 'other', label: 'Autre' },
];

export default function CreateDocumentPage() {
    const router = useRouter();
    const { session } = useAuth();
    const [titleFr, setTitleFr] = useState('');
    const [titleAr, setTitleAr] = useState('');
    const [descFr, setDescFr] = useState('');
    const [descAr, setDescAr] = useState('');
    const [reference, setReference] = useState('');
    const [fileType, setFileType] = useState<DocumentFileType>('pdf');
    const [theme, setTheme] = useState<DocumentTheme>('reglementation');
    const [direction, setDirection] = useState<DocumentDirection>('direction_generale');
    const [accessLevel, setAccessLevel] = useState<DocumentAccessLevel>('public');
    const [language, setLanguage] = useState<'fr' | 'ar' | 'fr_ar'>('fr');
    const [categories, setCategories] = useState('');
    const [keywords, setKeywords] = useState('');
    const [fileName, setFileName] = useState('');
    const [comment, setComment] = useState('');

    function handleSubmit(status: DocumentStatus) {
        if (!titleFr.trim()) {
            alert('Le titre français est requis');
            return;
        }
        if (!fileName.trim()) {
            alert('Le nom du fichier est requis');
            return;
        }

        createGedDocument({
            title: { fr: titleFr, ar: titleAr || titleFr },
            description: { fr: descFr, ar: descAr || descFr },
            reference: reference || undefined,
            fileType,
            categories: categories.split(',').map((c) => c.trim()).filter(Boolean),
            theme,
            direction,
            keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
            language,
            accessLevel,
            status,
            authorId: session?.user.id || 'system',
            initialVersion: {
                fileName,
                fileUrl: `/storage/uploads/new/${fileName}`,
                fileSize: Math.floor(Math.random() * 5_000_000) + 500_000,
                fileType,
                uploadedBy: session?.user.id || 'system',
                uploadedByName: session?.user.name || 'System User',
                comment: comment || 'Version initiale',
            },
        });

        router.push('/documents');
    }

    const inputClass = 'w-full px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-2 focus:ring-admin-primary/30';
    const labelClass = 'block text-admin-text text-sm font-medium mb-1.5';

    return (
        <RequirePermission module="documents" action="create">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-admin-text">Nouveau Document</h2>
                    <p className="text-admin-text-muted text-sm mt-1">Ajouter un document à la bibliothèque GED</p>
                </div>

                <div className="bg-admin-surface rounded-xl border border-admin-border p-6 space-y-6">
                    {/* Title FR / AR */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Titre (Français) *</label>
                            <input type="text" value={titleFr} onChange={(e) => setTitleFr(e.target.value)} placeholder="Ex: Tarifs portuaires 2025" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Titre (Arabe)</label>
                            <input type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} placeholder="العنوان بالعربية" dir="rtl" className={inputClass} />
                        </div>
                    </div>

                    {/* Description FR / AR */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Description (Français)</label>
                            <textarea value={descFr} onChange={(e) => setDescFr(e.target.value)} rows={3} placeholder="Description détaillée du document..." className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Description (Arabe)</label>
                            <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} rows={3} placeholder="وصف الوثيقة بالعربية..." dir="rtl" className={inputClass} />
                        </div>
                    </div>

                    {/* Reference + File type + Language */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Référence</label>
                            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="PAN-DOC-2025-XXX" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Type de fichier *</label>
                            <select value={fileType} onChange={(e) => setFileType(e.target.value as DocumentFileType)} className={inputClass}>
                                {fileTypes.map((ft) => (
                                    <option key={ft.value} value={ft.value}>{ft.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Langue du document</label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value as 'fr' | 'ar' | 'fr_ar')} className={inputClass}>
                                <option value="fr">Français</option>
                                <option value="ar">Arabe</option>
                                <option value="fr_ar">Bilingue (FR/AR)</option>
                            </select>
                        </div>
                    </div>

                    {/* Theme + Direction + Access */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Thème *</label>
                            <select value={theme} onChange={(e) => setTheme(e.target.value as DocumentTheme)} className={inputClass}>
                                {themes.map((th) => (
                                    <option key={th.value} value={th.value}>{th.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Direction / Entité *</label>
                            <select value={direction} onChange={(e) => setDirection(e.target.value as DocumentDirection)} className={inputClass}>
                                {directions.map((d) => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Niveau d&apos;accès *</label>
                            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as DocumentAccessLevel)} className={inputClass}>
                                <option value="public">🌐 Public</option>
                                <option value="restricted">🔒 Restreint</option>
                                <option value="internal">🏢 Interne</option>
                            </select>
                        </div>
                    </div>

                    {/* Categories + Keywords */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Catégories (séparées par des virgules)</label>
                            <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="tarification, réglementation" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Mots-clés (séparés par des virgules)</label>
                            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="tarifs, prix, barème" className={inputClass} />
                        </div>
                    </div>

                    {/* File upload section */}
                    <div className="border-t border-admin-border pt-6">
                        <h3 className="text-admin-text font-semibold mb-4">📁 Fichier à téléverser</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nom du fichier *</label>
                                <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="tarifs-2025.pdf" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Commentaire de version</label>
                                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Version initiale" className={inputClass} />
                            </div>
                        </div>
                        {/* Mock file drop zone */}
                        <div className="mt-4 border-2 border-dashed border-admin-border rounded-xl p-8 text-center hover:border-admin-primary/40 transition-colors cursor-pointer">
                            <div className="text-admin-text-muted text-sm">
                                <span className="text-3xl block mb-2">📤</span>
                                Glissez un fichier ici ou cliquez pour parcourir
                                <br />
                                <span className="text-[10px] text-admin-text-muted/60 mt-1 block">
                                    PDF, Word, Excel, PowerPoint, Images · Max 50 Mo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 justify-end">
                    <button
                        onClick={() => router.push('/documents')}
                        className="px-5 py-2.5 border border-admin-border text-admin-text-muted text-sm rounded-xl hover:bg-admin-surface-alt transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => handleSubmit('draft')}
                        className="px-5 py-2.5 bg-amber-500/15 text-amber-400 text-sm font-medium rounded-xl hover:bg-amber-500/25 transition-colors"
                    >
                        Enregistrer comme brouillon
                    </button>
                    <button
                        onClick={() => handleSubmit('published')}
                        className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors"
                    >
                        Publier le document
                    </button>
                </div>
            </div>
        </RequirePermission>
    );
}
