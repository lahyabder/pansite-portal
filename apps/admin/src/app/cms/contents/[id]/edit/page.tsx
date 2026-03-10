'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@pan/shared';
import type { Content, ContentCategory } from '@pan/shared';
import { updateContentAction, getContentByIdAction, uploadFileAction, preTranslateAction } from '../../../../actions';
import Link from 'next/link';
import { RequirePermission, useAuth } from '@/lib/auth';
import { Upload, X, Image as ImageIcon, RotateCcw, Save, Globe } from 'lucide-react';

export default function EditContentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { session } = useAuth();

    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [form, setForm] = useState<any>({
        title: { fr: '', ar: '', en: '', es: '' },
        excerpt: { fr: '', ar: '', en: '', es: '' },
        body: { fr: '', ar: '', en: '', es: '' },
        category: 'actualite',
        tags: '',
        priority: 'normal',
        eventDate: '',
        eventEndDate: '',
        eventLocation: '',
        expiresAt: '',
        externalLink: '',
        videoLink: '',
    });
    const [activeLang, setActiveLang] = useState('fr');
    const [translating, setTranslating] = useState(false);

    useEffect(() => {
        if (!id) return;
        getContentByIdAction(id).then(data => {
            if (data) {
                setContent(data);
                setExistingImages(data.images || []);
                setForm({
                    title: data.title,
                    excerpt: data.excerpt,
                    body: data.body,
                    category: data.category,
                    tags: data.tags.join(', '),
                    priority: data.priority || 'normal',
                    eventDate: data.eventDate || '',
                    eventEndDate: data.eventEndDate || '',
                    eventLocation: data.eventLocation || '',
                    expiresAt: data.expiresAt || '',
                    externalLink: data.externalLink || '',
                    videoLink: data.videoLink || '',
                });
            }
            setLoading(false);
        });
    }, [id]);

    const handleTranslate = async () => {
        const sourceTitle = form.title[activeLang];
        const sourceExcerpt = form.excerpt[activeLang];
        const sourceBody = form.body[activeLang];

        if (!sourceTitle) return;

        setTranslating(true);
        try {
            const translations = await preTranslateAction({
                title: sourceTitle,
                excerpt: sourceExcerpt,
                body: sourceBody,
                sourceLang: activeLang
            });

            setForm((prev: any) => ({
                ...prev,
                title: { ...prev.title, ...translations.title },
                excerpt: { ...prev.excerpt, ...translations.excerpt },
                body: { ...prev.body, ...translations.body },
            }));
        } catch (error) {
            console.error('Translation failed', error);
        } finally {
            setTranslating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number, isExisting: boolean) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setSelectedFiles(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async (published: boolean = false) => {
        setSaving(true);

        // 1. Upload new images if any
        let newImageUrls: string[] = [];
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach(f => formData.append('files', f));
            newImageUrls = await uploadFileAction(formData);
        }

        const allImages = [...existingImages, ...newImageUrls];

        await updateContentAction(id, {
            slug: slugify(form.title.fr || form.title.en || form.title.ar || ''),
            title: form.title,
            excerpt: form.excerpt,
            body: form.body,
            category: form.category as ContentCategory,
            tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
            priority: form.priority as 'normal' | 'important' | 'urgent',
            eventDate: form.eventDate || undefined,
            eventEndDate: form.eventEndDate || undefined,
            eventLocation: form.eventLocation || undefined,
            expiresAt: form.expiresAt || undefined,
            externalLink: form.externalLink || undefined,
            videoLink: form.videoLink || undefined,
            images: allImages,
            ...(published ? { status: 'published', publishedAt: new Date().toISOString() } : {})
        }, session?.user.id || 'system');

        router.push('/cms/contents');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-pan-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-admin-text-muted text-sm font-medium">Chargement du contenu...</p>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="text-center py-20 bg-admin-surface rounded-3xl border border-white/5 mx-auto max-w-lg shadow-2xl">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl text-white/20">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Contenu introuvable</h2>
                <Link href="/cms/contents" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                    ← Retour à la liste
                </Link>
            </div>
        );
    }

    const inputClass = 'w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all';

    return (
        <RequirePermission module="content" action="edit">
            <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/cms/contents" className="text-admin-text-muted text-sm hover:text-admin-text transition-colors flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" /> Retour
                        </Link>
                        <h2 className="text-2xl font-bold text-admin-text mt-2 italic tracking-tighter">Modifier l'article</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-admin-text-muted font-mono">{id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">{content.status}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {content.status !== 'published' && (
                            <button
                                onClick={() => handleSave(true)}
                                disabled={saving}
                                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-all flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" /> {saving ? 'Publication...' : 'Enregistrer & Publier'}
                            </button>
                        )}
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            className="px-5 py-2.5 bg-admin-primary text-white text-sm font-bold rounded-xl hover:bg-admin-primary/80 disabled:opacity-40 transition-all flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>

                {/* Translation UI */}
                <div className="bg-admin-surface rounded-3xl border border-admin-border p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-admin-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center p-1 bg-admin-bg border border-admin-border rounded-2xl">
                            {[
                                { id: 'fr', label: 'Français', flag: '🇫🇷' },
                                { id: 'ar', label: 'العربية', flag: '🇲🇷' },
                                { id: 'en', label: 'English', flag: '🇬🇧' },
                                { id: 'es', label: 'Español', flag: '🇪🇸' },
                            ].map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => setActiveLang(lang.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeLang === lang.id ? 'bg-admin-primary text-white shadow-lg' : 'text-admin-text-muted hover:text-admin-text'}`}
                                >
                                    <span>{lang.flag}</span>
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleTranslate}
                            disabled={translating || !form.title[activeLang]}
                            className="w-full sm:w-auto px-5 py-2.5 bg-pan-gold text-pan-navy text-xs font-bold rounded-xl hover:bg-pan-gold-light disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-pan-gold/20"
                        >
                            <Globe className={`w-4 h-4 ${translating ? 'animate-spin' : ''}`} />
                            {translating ? 'Traduction...' : `Traduire vers les autres langues`}
                        </button>
                    </div>

                    {/* Editor Fields */}
                    <div className="space-y-6" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
                        <div>
                            <label className="block text-admin-text-muted text-[11px] font-bold uppercase tracking-wider mb-2">
                                {activeLang === 'ar' ? 'العنوان' : "Titre de l'article"} ({activeLang.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                value={form.title[activeLang] || ''}
                                onChange={(e) => setForm({ ...form, title: { ...form.title, [activeLang]: e.target.value } })}
                                className={inputClass}
                                placeholder={activeLang === 'ar' ? 'اكتب العنوان هنا...' : 'Entrez le titre...'}
                            />
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-[11px] font-bold uppercase tracking-wider mb-2">
                                {activeLang === 'ar' ? 'الملخص' : "Extrait (Résumé)"} ({activeLang.toUpperCase()})
                            </label>
                            <textarea
                                rows={2}
                                value={form.excerpt[activeLang] || ''}
                                onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, [activeLang]: e.target.value } })}
                                className={inputClass + ' resize-none'}
                                placeholder={activeLang === 'ar' ? 'اكتب ملخصاً قصيراً...' : 'Résumé...'}
                            />
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-[11px] font-bold uppercase tracking-wider mb-2">
                                {activeLang === 'ar' ? 'نص الخبر' : "Corps de l'article"} ({activeLang.toUpperCase()})
                            </label>
                            <textarea
                                rows={12}
                                value={form.body[activeLang] || ''}
                                onChange={(e) => setForm({ ...form, body: { ...form.body, [activeLang]: e.target.value } })}
                                className={inputClass + ' resize-none font-sans leading-relaxed'}
                                placeholder={activeLang === 'ar' ? 'اكتب محتوى الخبر هنا بالتفصيل...' : 'Détails de l\'article...'}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Media */}
                        <div className="bg-admin-surface rounded-3xl border border-admin-border p-8 shadow-xl">
                            <h3 className="text-admin-text font-bold mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                🖼️ Media & Galerie
                            </h3>

                            <div className="space-y-6">
                                {/* Current Images */}
                                {(existingImages.length > 0 || previews.length > 0) && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {existingImages.map((img, i) => (
                                            <div key={`exist-${i}`} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-lg bg-black/40">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => removeFile(i, true)} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><X className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                        {previews.map((prev, i) => (
                                            <div key={`new-${i}`} className="relative group aspect-square rounded-2xl overflow-hidden border border-admin-primary/30 shadow-lg bg-black/40 animate-pulse-subtle">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={prev} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => removeFile(i, false)} className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><X className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="relative">
                                    <input type="file" id="edit-image-upload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                    <label
                                        htmlFor="edit-image-upload"
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-admin-primary/50 transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 bg-admin-primary/10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-admin-primary" />
                                        </div>
                                        <div className="text-admin-text text-sm font-bold">Ajouter des photos</div>
                                        <div className="text-admin-text-muted text-[10px] mt-1 uppercase tracking-widest">JPG, PNG, WEBP (Max 5MB)</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Meta Sidebar */}
                        <div className="bg-admin-surface rounded-3xl border border-admin-border p-6 shadow-xl sticky top-24">
                            <h4 className="text-white text-sm font-bold mb-5 flex items-center gap-2">
                                <span className="w-1 h-4 bg-pan-gold rounded-full" /> Paramètres
                            </h4>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">Catégorie</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ContentCategory })} className={inputClass}>
                                        <option value="actualite">📰 Actualité</option>
                                        <option value="communique">📢 Communiqué</option>
                                        <option value="evenement">📅 Événement</option>
                                        <option value="alerte">⚠️ Alerte</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">Priorité</label>
                                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })} className={inputClass}>
                                        <option value="normal">Normal</option>
                                        <option value="important">⚡ Important</option>
                                        <option value="urgent">🚨 Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">Tags</label>
                                    <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="infrastructure, port..." />
                                </div>

                                <div className="pt-5 border-t border-white/5 space-y-4">
                                    <h5 className="text-[10px] font-bold text-white/40 uppercase">Liens externes</h5>
                                    <div>
                                        <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-1.5">Lien Document (URL)</label>
                                        <input type="url" value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} className={inputClass + ' text-[11px]'} placeholder="https://..." />
                                    </div>
                                    <div>
                                        <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-1.5">Lien Vidéo (URL)</label>
                                        <input type="url" value={form.videoLink} onChange={(e) => setForm({ ...form, videoLink: e.target.value })} className={inputClass + ' text-[11px]'} placeholder="https://youtube.com/..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RequirePermission>
    );
}
