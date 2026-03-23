'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createContentAction, updateContentAction, uploadFileAction, preTranslateAction } from '@/app/actions';
import { slugify } from '@pan/shared';
import type { Content, ContentCategory, ContentStatus } from '@pan/shared';
import { Save, ArrowLeft, Globe, Loader2, Upload, X, Sparkles } from 'lucide-react';

type Locale = 'fr' | 'ar' | 'en' | 'es';
const LOCALES: { key: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
    { key: 'fr', label: 'Français', dir: 'ltr' },
    { key: 'ar', label: 'العربية', dir: 'rtl' },
    { key: 'en', label: 'English', dir: 'ltr' },
    { key: 'es', label: 'Español', dir: 'ltr' },
];

const CATEGORIES: { key: ContentCategory; label: string }[] = [
    { key: 'actualite', label: 'Actualité' },
    { key: 'communique', label: 'Communiqué' },
    { key: 'evenement', label: 'Événement' },
    { key: 'alerte', label: 'Alerte' },
    { key: 'le-port', label: 'Le Port' },
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'services', label: 'Services' },
    { key: 'procedures', label: 'Procédures' },
    { key: 'tariffs', label: 'Tarifs' },
    { key: 'tenders', label: "Appels d'offres" },
    { key: 'media', label: 'Médias' },
];

interface ContentFormProps {
    initial?: Partial<Content>;
    isEdit?: boolean;
    basePath?: string;
}

export function ContentForm({ initial, isEdit, basePath = '/news' }: ContentFormProps) {
    const router = useRouter();
    const [locale, setLocale] = useState<Locale>('fr');
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Multi-locale fields
    const [titles, setTitles] = useState<Record<Locale, string>>({
        fr: '', ar: '', en: '', es: '',
        ...(typeof initial?.title === 'object' ? initial.title as any : {}),
    });
    const [excerpts, setExcerpts] = useState<Record<Locale, string>>({
        fr: '', ar: '', en: '', es: '',
        ...(typeof initial?.excerpt === 'object' ? initial.excerpt as any : {}),
    });
    const [bodies, setBodies] = useState<Record<Locale, string>>({
        fr: '', ar: '', en: '', es: '',
        ...(typeof initial?.body === 'object' ? initial.body as any : {}),
    });

    // Meta fields
    const [category, setCategory] = useState<ContentCategory>(initial?.category || 'actualite');
    const [status, setStatus] = useState<ContentStatus>(initial?.status || 'draft');
    const [slug, setSlug] = useState(initial?.slug || '');
    const [images, setImages] = useState<string[]>(initial?.images || (initial?.coverImage ? [initial.coverImage] : []));
    const [coverImage, setCoverImage] = useState(initial?.coverImage || '');
    const [eventDate, setEventDate] = useState(initial?.eventDate || '');
    const [expiresAt, setExpiresAt] = useState(initial?.expiresAt || '');
    const [externalLink, setExternalLink] = useState(initial?.externalLink || '');
    const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>(initial?.priority || 'normal');

    // Auto-generate slug
    useEffect(() => {
        if (!isEdit && titles.fr) {
            setSlug(slugify(titles.fr));
        }
    }, [titles.fr, isEdit]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploadingImage(true);
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('files', file));
        
        const urls = await uploadFileAction(formData);
        if (urls && urls.length > 0) {
            setImages(prev => [...prev, ...urls]);
            if (!coverImage) {
                setCoverImage(urls[0]);
            }
        }
        setUploadingImage(false);
    };

    const removeImage = (url: string) => {
        setImages(prev => prev.filter(img => img !== url));
        if (coverImage === url) {
            setCoverImage(images.find(img => img !== url) || '');
        }
    };

    const handleAutoTranslate = async () => {
        if (!titles[locale]) {
            setError("Veuillez d'abord saisir un titre dans la langue actuelle avant de traduire.");
            return;
        }
        
        setIsTranslating(true);
        setError('');
        
        try {
            const trans = await preTranslateAction({
                title: titles[locale],
                excerpt: excerpts[locale] || '',
                body: bodies[locale] || '',
                sourceLang: locale
            });
            
            if (trans?.title) {
                setTitles(prev => ({ ...prev, ...trans.title }));
            }
            if (trans?.excerpt) {
                setExcerpts(prev => ({ ...prev, ...trans.excerpt }));
            }
            if (trans?.body) {
                setBodies(prev => ({ ...prev, ...trans.body }));
            }
            setSuccess('Traduction réussie !');
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError("Une erreur est survenue lors de la traduction.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubmit = async (newStatus?: string) => {
        setSaving(true);
        setError('');
        setSuccess('');

        const payload = {
            title: titles,
            excerpt: excerpts,
            body: bodies,
            slug,
            category,
            status: newStatus || status,
            coverImage: coverImage || images[0] || '',
            images,
            eventDate: eventDate || null,
            expiresAt: expiresAt || null,
            externalLink: externalLink || null,
            priority,
            publishedAt: (newStatus === 'published' || status === 'published') ? new Date().toISOString() : undefined,
        };

        try {
            if (isEdit && initial?.id) {
                await updateContentAction(initial.id, payload as any, 'admin');
                setSuccess('Contenu mis à jour avec succès !');
            } else {
                const res = await createContentAction(payload as any);
                if (res?.id) {
                    setSuccess('Contenu créé avec succès !');
                    
                    const getCategoryPath = (cat: string) => {
                        switch (cat) {
                            case 'le-port':
                            case 'infrastructure': return '/pages';
                            case 'services': return '/services';
                            case 'procedures': return '/procedures';
                            case 'tariffs': return '/tariffs';
                            case 'tenders': return '/tenders';
                            case 'media': return '/media';
                            case 'actualite':
                            case 'communique':
                            case 'alerte':
                            case 'evenement':
                            default: return '/news';
                        }
                    };
                    
                    setTimeout(() => router.push(`${getCategoryPath(category)}/${res.id}/edit`), 1200);
                }
            }
        } catch (e) {
            console.error(e);
            setError("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    };

    const activeLocaleConfig = LOCALES.find(l => l.key === locale)!;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Topbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                    onClick={() => router.push(basePath)}
                    className="flex items-center gap-2 text-pan-gray-500 hover:text-pan-navy text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </button>

                <div className="flex items-center gap-3">
                    {/* Status */}
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value as ContentStatus)}
                        className="px-3 py-2 border border-pan-gray-200 rounded-xl text-sm bg-white"
                    >
                        <option value="draft">Brouillon</option>
                        <option value="pending_approval">Soumettre pour révision</option>
                        <option value="published">Publié</option>
                        <option value="archived">Archivé</option>
                    </select>

                    <button
                        onClick={() => handleSubmit()}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-pan-sky text-white rounded-xl font-semibold text-sm hover:bg-pan-blue transition-all shadow-sm disabled:opacity-60"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Enregistrer
                    </button>
                    <button
                        onClick={() => handleSubmit('published')}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all shadow-sm disabled:opacity-60"
                    >
                        🚀 Publier
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">⚠️ {error}</div>
            )}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">✅ {success}</div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main editing area */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Language tabs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-pan-gray-100 pr-3">
                            <div className="flex px-1 pt-1 overflow-x-auto no-scrollbar">
                                {LOCALES.map(l => (
                                    <button
                                        type="button"
                                        key={l.key}
                                        onClick={() => setLocale(l.key)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap ${l.key === locale ? 'text-pan-sky border-b-2 border-pan-sky' : 'text-pan-gray-400 hover:text-pan-navy'}`}
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        {l.label}
                                        {titles[l.key] && l.key !== locale && <span className="w-2 h-2 rounded-full bg-green-400 block flex-shrink-0" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating || !titles[locale]}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pan-navy bg-pan-sky/10 hover:bg-pan-sky/20 rounded-lg transition-colors disabled:opacity-50"
                                title={`Traduire automatiquement depuis ${activeLocaleConfig.label}`}
                            >
                                {isTranslating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                                Traduire ({locale.toUpperCase()})
                            </button>
                        </div>

                        <div className="p-6 space-y-4" dir={activeLocaleConfig.dir}>
                            <div>
                                <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Titre</label>
                                <input
                                    type="text"
                                    value={titles[locale]}
                                    onChange={e => setTitles(t => ({ ...t, [locale]: e.target.value }))}
                                    lang={locale}
                                    className="w-full px-4 py-3 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky font-semibold text-pan-navy"
                                    placeholder="Entrez le titre..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Extrait / sous-titre</label>
                                <textarea
                                    value={excerpts[locale]}
                                    onChange={e => setExcerpts(t => ({ ...t, [locale]: e.target.value }))}
                                    rows={3}
                                    lang={locale}
                                    className="w-full px-4 py-3 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky resize-none"
                                    placeholder="Résumé court..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Contenu complet</label>
                                <textarea
                                    value={bodies[locale]}
                                    onChange={e => setBodies(t => ({ ...t, [locale]: e.target.value }))}
                                    rows={14}
                                    lang={locale}
                                    className="w-full px-4 py-3 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky resize-y font-mono min-h-[280px]"
                                    placeholder="Contenu complet de l'article (Markdown supporté)..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar settings */}
                <div className="space-y-5">
                    {/* Category & meta */}
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-5 space-y-4">
                        <h3 className="text-sm font-bold text-pan-navy uppercase tracking-wider">Paramètres</h3>

                        <div>
                            <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Catégorie</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as ContentCategory)}
                                className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 bg-white"
                            >
                                {CATEGORIES.map(c => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Priorité</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as 'normal' | 'important' | 'urgent')}
                                className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 bg-white"
                            >
                                <option value="normal">Normale</option>
                                <option value="important">Importante</option>
                                <option value="urgent">🔴 Urgente</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Slug URL</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-pan-sky/20 text-pan-gray-600"
                                placeholder="slug-automatique"
                            />
                        </div>

                        {(category === 'evenement') && (
                            <div>
                                <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Date de l'événement</label>
                                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20" />
                            </div>
                        )}
                        {(category === 'tenders') && (
                            <div>
                                <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Date de clôture</label>
                                <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20" />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-pan-gray-500 uppercase tracking-wider mb-2">Lien externe / PDF</label>
                            <input
                                type="url"
                                value={externalLink}
                                onChange={e => setExternalLink(e.target.value)}
                                className="w-full px-3 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Media / Images */}
                    <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-5 space-y-3">
                        <h3 className="text-sm font-bold text-pan-navy uppercase tracking-wider flex items-center justify-between">
                            Images & Couverture
                            <span className="text-xs font-normal text-pan-gray-400 capitalize bg-pan-gray-50 px-2 py-0.5 rounded">Galerie acceptée</span>
                        </h3>

                        {images.length > 0 ? (
                            <div className="space-y-4">
                                {/* Selected Cover */}
                                <div className="relative group rounded-xl overflow-hidden aspect-video bg-pan-gray-50 border-2 border-pan-sky/20">
                                    <div className="absolute top-2 left-2 z-10 bg-pan-sky text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                                        ⭐ Couverture
                                    </div>
                                    <img src={coverImage || images[0]} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                                
                                {/* Thumbnails Gallery */}
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {images.map((url, i) => {
                                        const isCover = (coverImage || images[0]) === url;
                                        return (
                                            <div key={i} className={`relative group aspect-square rounded-lg overflow-hidden bg-pan-gray-50 border-2 transition-all ${isCover ? 'border-pan-sky' : 'border-transparent hover:border-pan-gray-300'}`}>
                                                <img src={url} alt={`Image ${i+1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                                    {!isCover && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCoverImage(url)}
                                                            className="p-1.5 bg-pan-sky text-white rounded hover:bg-pan-blue transition-colors text-[10px] font-bold"
                                                            title="Définir comme couverture"
                                                        >
                                                            ⭐
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(url)}
                                                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Add More Button */}
                                    <label className="flex flex-col items-center justify-center aspect-square bg-pan-gray-50 border-2 border-dashed border-pan-gray-200 rounded-lg cursor-pointer hover:border-pan-sky hover:bg-pan-sky/5 transition-all">
                                        {uploadingImage ? (
                                            <Loader2 className="w-4 h-4 text-pan-sky animate-spin" />
                                        ) : (
                                            <Upload className="w-5 h-5 text-pan-gray-400" />
                                        )}
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center aspect-video bg-pan-gray-50 border-2 border-dashed border-pan-gray-200 rounded-xl cursor-pointer hover:border-pan-sky hover:bg-pan-sky/5 transition-all">
                                {uploadingImage ? (
                                    <Loader2 className="w-6 h-6 text-pan-sky animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-pan-gray-300 mb-2" />
                                        <span className="text-xs font-bold text-pan-gray-400">Cliquer pour uploader (une ou plusieurs)</span>
                                        <span className="text-[10px] text-pan-gray-300 mt-1">JPG, PNG, WebP · Max 5 MB / image</span>
                                    </>
                                )}
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-pan-gray-500 mb-1.5">Ou entrez une URL (ajoute à la galerie)</label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    id="url-input"
                                    className="flex-1 px-3 py-2 border border-pan-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pan-sky/20"
                                    placeholder="https://..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = e.currentTarget.value;
                                            if (val) {
                                                setImages(prev => [...prev, val]);
                                                if (!coverImage) setCoverImage(val);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                                <button 
                                    type="button"
                                    className="px-3 py-2 bg-pan-gray-100 text-pan-gray-600 rounded-xl text-xs font-bold hover:bg-pan-gray-200"
                                    onClick={() => {
                                        const input = document.getElementById('url-input') as HTMLInputElement;
                                        if (input?.value) {
                                            setImages(prev => [...prev, input.value]);
                                            if (!coverImage) setCoverImage(input.value);
                                            input.value = '';
                                        }
                                    }}
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
