'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContentAction, uploadFileAction, preTranslateAction } from '../../../actions';
import { slugify } from '@pan/shared';
import type { ContentCategory, Locale } from '@pan/shared';
import Link from 'next/link';
import { RequirePermission, useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { Upload, X, Image as ImageIcon, Rocket, Globe, Layout, Save } from 'lucide-react';

export default function CreateContentPage() {
    const router = useRouter();
    const { session } = useAuth();
    const { t: dict, locale, isRTL } = useI18n();
    const [saving, setSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [form, setForm] = useState({
        title: { fr: '', ar: '', en: '', es: '' },
        excerpt: { fr: '', ar: '', en: '', es: '' },
        body: { fr: '', ar: '', en: '', es: '' },
        category: 'actualite' as ContentCategory,
        tags: '',
        priority: 'normal' as 'normal' | 'important' | 'urgent',
        eventDate: '',
        eventEndDate: '',
        eventLocation: '',
        expiresAt: '',
        externalLink: '',
        videoLink: '',
    });
    const [activeLang, setActiveLang] = useState(locale);
    const [translating, setTranslating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleTranslate = async () => {
        const sourceTitle = (form.title as any)[activeLang];
        const sourceExcerpt = (form.excerpt as any)[activeLang];
        const sourceBody = (form.body as any)[activeLang];

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
            alert(dict.cms.messages.translateError);
        } finally {
            setTranslating(false);
        }
    };

    const handleSubmit = async (asDraft: boolean) => {
        const mainTitle = form.title.fr || form.title.ar || form.title.en || form.title.es || '';
        if (!mainTitle.trim()) return;
        setSaving(true);

        try {
            // 1. Upload images first
            let imageUrls: string[] = [];
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach(f => formData.append('files', f));
                imageUrls = await uploadFileAction(formData);
            }

            const slug = slugify(mainTitle);

            const result = await createContentAction({
                slug,
                title: form.title,
                excerpt: form.excerpt,
                body: form.body,
                category: form.category,
                tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
                status: asDraft ? 'draft' : 'published',
                priority: form.priority,
                authorId: session?.user.id || 'system',
                publishedAt: asDraft ? undefined : new Date().toISOString(),
                eventDate: form.eventDate || undefined,
                eventEndDate: form.eventEndDate || undefined,
                eventLocation: form.eventLocation || undefined,
                expiresAt: form.expiresAt || undefined,
                externalLink: form.externalLink || undefined,
                videoLink: form.videoLink || undefined,
                images: imageUrls,
            });

            if (result === null) {
                throw new Error('API connection error');
            }

            router.push('/cms/contents');
        } catch (error) {
            console.error('Submission failed', error);
            alert(dict.cms.messages.saveError);
        } finally {
            setSaving(false);
        }
    };

    const inputClass = 'w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all';

    return (
        <RequirePermission module="content" action="create">
            <div className="max-w-5xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/cms/contents" className="text-admin-text-muted text-sm hover:text-admin-text transition-colors flex items-center gap-2">
                            {dict.cms.backToList}
                        </Link>
                        <h2 className="text-2xl font-bold text-admin-text mt-2 italic tracking-tighter">{dict.cms.creation.title}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={saving || !(form.title as any)[activeLang]}
                            className="px-5 py-2.5 text-admin-text-muted text-sm font-bold hover:text-admin-text transition-all"
                        >
                            {saving ? dict.cms.creation.saving : dict.cms.creation.draft}
                        </button>
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={saving || !(form.title as any)[activeLang]}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 disabled:opacity-40 transition-all flex items-center gap-2"
                        >
                            <Rocket className="w-4 h-4" /> {saving ? dict.cms.creation.publishing : dict.cms.creation.publish}
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Editor Section */}
                        <div className="bg-admin-surface rounded-3xl border border-admin-border p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-admin-primary/5 blur-3xl rounded-full -mr-24 -mt-24" />

                            <div className="relative">
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
                                                onClick={() => setActiveLang(lang.id as Locale)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeLang === lang.id ? 'bg-admin-primary text-white shadow-lg' : 'text-admin-text-muted hover:text-admin-text'}`}
                                            >
                                                <span>{lang.flag}</span>
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleTranslate}
                                        disabled={translating || !(form.title as any)[activeLang]}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-pan-gold text-pan-navy text-xs font-bold rounded-xl hover:bg-pan-gold-light disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Globe className={`w-4 h-4 ${translating ? 'animate-spin' : ''}`} />
                                        {translating ? dict.cms.creation.translating : dict.cms.creation.translate}
                                    </button>
                                </div>

                                <div className="space-y-6" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
                                    <div>
                                        <label className="block text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 px-1">
                                            {dict.cms.form.title} ({activeLang.toUpperCase()}) *
                                        </label>
                                        <input
                                            type="text"
                                            value={(form.title as any)[activeLang]}
                                            onChange={(e) => setForm({ ...form, title: { ...form.title, [activeLang]: e.target.value } })}
                                            placeholder={dict.cms.form.titlePlaceholder}
                                            className={inputClass + ' text-lg font-bold text-start'}
                                        />
                                        {activeLang === 'fr' && (form.title as any).fr && (
                                            <div className="text-[10px] font-mono text-admin-text-muted mt-2 px-1 opacity-50 italic">
                                                URL : {slugify((form.title as any).fr)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 px-1">
                                            {dict.cms.form.excerpt} ({activeLang.toUpperCase()})
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={(form.excerpt as any)[activeLang]}
                                            onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, [activeLang]: e.target.value } })}
                                            placeholder={dict.cms.form.excerptPlaceholder}
                                            className={inputClass + ' resize-none text-start'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-admin-text-muted text-[10px] font-bold uppercase tracking-widest mb-2 px-1">
                                            {dict.cms.form.body} ({activeLang.toUpperCase()})
                                        </label>
                                        <textarea
                                            rows={12}
                                            value={(form.body as any)[activeLang]}
                                            onChange={(e) => setForm({ ...form, body: { ...form.body, [activeLang]: e.target.value } })}
                                            placeholder={dict.cms.form.bodyPlaceholder}
                                            className={inputClass + ' resize-none font-sans leading-relaxed text-start'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="bg-admin-surface rounded-3xl border border-admin-border p-8 shadow-xl">
                            <h3 className="text-admin-text font-bold mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                🖼️ {dict.cms.creation.imageGallery}
                            </h3>

                            <div className="space-y-6">
                                {/* Upload Area */}
                                <div className="relative group">
                                    <input type="file" id="image-upload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-admin-primary/40 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-admin-primary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6 text-admin-primary" />
                                        </div>
                                        <div className="text-admin-text font-bold text-sm">{dict.cms.creation.dropzone}</div>
                                        <div className="text-admin-text-muted text-[10px] mt-1 tracking-wider uppercase opacity-50">{dict.cms.creation.imageDisclaimer}</div>
                                    </label>
                                </div>

                                {/* Previews */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                        {previews.map((preview, index) => (
                                            <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeFile(index)} className="w-10 h-10 bg-red-500/80 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-xl">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Sidebar Config */}
                        <div className="bg-admin-surface rounded-3xl border border-admin-border p-7 shadow-xl sticky top-24">
                            <h4 className="text-white text-xs font-bold mb-6 flex items-center gap-2 uppercase tracking-widest opacity-60">
                                <Layout className="w-3 h-3 text-pan-gold" /> Configuration
                            </h4>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">{dict.cms.form.category}</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className={inputClass}>
                                        <option value="actualite">📰 {dict.contentManagement.categories.actualite}</option>
                                        <option value="communique">📢 {dict.contentManagement.categories.communique}</option>
                                        <option value="evenement">📅 {dict.contentManagement.categories.evenement}</option>
                                        <option value="alerte">⚠️ {dict.contentManagement.categories.alerte}</option>
                                        <option value="le-port">⚓ {dict.contentManagement.categories['le-port']}</option>
                                        <option value="infrastructure">🏗️ {dict.contentManagement.categories.infrastructure}</option>
                                        <option value="services">🛠️ {dict.contentManagement.categories.services}</option>
                                        <option value="procedures">📜 {dict.contentManagement.categories.procedures}</option>
                                        <option value="tariffs">💰 {dict.contentManagement.categories.tariffs}</option>
                                        <option value="stopovers">🚢 {dict.contentManagement.categories.stopovers}</option>
                                        <option value="tenders">📝 {dict.contentManagement.categories.tenders}</option>
                                        <option value="documentation">📂 {dict.contentManagement.categories.documentation}</option>
                                        <option value="media">🖼️ {dict.contentManagement.categories.media}</option>
                                        <option value="contact">📞 {dict.contentManagement.categories.contact}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">{dict.cms.form.priority}</label>
                                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })} className={inputClass}>
                                        <option value="normal">{dict.contentManagement.priorities.normal}</option>
                                        <option value="important">⚡ {dict.contentManagement.priorities.important}</option>
                                        <option value="urgent">🚨 {dict.contentManagement.priorities.urgent}</option>
                                    </select>
                                </div>

                                {form.category === 'evenement' && (
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div>
                                            <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-1.5">{dict.cms.form.startDate}</label>
                                            <input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className={inputClass + ' text-xs'} />
                                        </div>
                                        <div>
                                            <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-1.5">{dict.cms.form.location}</label>
                                            <input type="text" value={form.eventLocation} onChange={(e) => setForm({ ...form, eventLocation: e.target.value })} className={inputClass + ' text-xs'} placeholder="Nouadhibou..." />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-admin-text-muted text-[10px] font-bold uppercase mb-2">{dict.cms.form.tags}</label>
                                    <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder={dict.cms.form.tagsPlaceholder} className={inputClass} />
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">{dict.cms.form.resources}</h5>
                                    <div>
                                        <input type="url" value={form.externalLink} onChange={(e) => setForm({ ...form, externalLink: e.target.value })} placeholder={dict.cms.form.docLink} className={inputClass + ' text-[11px]'} />
                                    </div>
                                    <div>
                                        <input type="url" value={form.videoLink} onChange={(e) => setForm({ ...form, videoLink: e.target.value })} placeholder={dict.cms.form.videoLink} className={inputClass + ' text-[11px]'} />
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
