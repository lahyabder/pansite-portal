'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, 
  ChevronLeft, 
  RefreshCw, 
  FileText,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';
import { translateContentAction, uploadAssetAction } from '@/app/actions';

const LOCALES = [
  { id: 'fr', label: 'Français' },
  { id: 'ar', label: 'العربية' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
];

interface ContentEditorProps {
  initialData?: any;
  id?: string;
  onSave: (data: any) => Promise<void>;
}

export default function ContentEditor({ initialData, id, onSave }: ContentEditorProps) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState('fr');
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  const [content, setContent] = useState<any>(initialData || {
    slug: '',
    title: { fr: '', ar: '', en: '', es: '' },
    body: { fr: '', ar: '', en: '', es: '' },
    excerpt: { fr: '', ar: '', en: '', es: '' },
    category: 'actualite',
    status: 'draft',
    coverImage: '',
    publishedAt: initialData?.publishedAt || new Date().toISOString().substring(0, 10),
    tags: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const url = await uploadAssetAction(formData);
      setContent({ ...content, coverImage: url });
    } catch (err: any) {
      alert('Erreur lors du téléchargement: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
      router.push('/contents');
    } catch (err: any) {
      alert('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const setLocalizedValue = (field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [activeLang]: value }
    }));
  };

  const autoTranslate = async (field: string) => {
    // Translates the field from FR (or active) to the other languages
    const sourceText = content[field][activeLang];
    if (!sourceText) return;

    setTranslating(true);
    try {
      const translations: any = { ...content[field] };
      for (const loc of LOCALES) {
        if (loc.id !== activeLang) {
          const translated = await translateContentAction(sourceText, loc.id);
          translations[loc.id] = translated;
        }
      }
      setContent({ ...content, [field]: translations });
    } catch (err: any) {
      alert('Erreur IA: ' + err.message);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] -m-8 relative">
      {/* ─── Editor Header ─── */}
      <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/contents" className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-[1px] bg-white/5"></div>
          <div>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={content.title?.[activeLang] || ''} 
                onChange={e => setLocalizedValue('title', e.target.value)}
                placeholder="Titre de l'article..."
                className="bg-transparent border-none outline-none font-outfit text-xl font-black text-white placeholder:text-slate-700 min-w-[300px]"
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-black text-slate-500 border border-white/5 uppercase">/{content.slug || 'slug-placeholder'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            {LOCALES.map(loc => (
              <button
                key={loc.id}
                onClick={() => setActiveLang(loc.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeLang === loc.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {loc.id.toUpperCase()}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 bg-slate-950/50">
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* META Settings */}
            <div className="flex gap-4">
              <div className="flex-1 p-6 bg-slate-900 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Slug (URL)</label>
                <input 
                  type="text"
                  value={content.slug}
                  onChange={e => setContent({ ...content, slug: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div className="flex-1 p-6 bg-slate-900 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Catégorie</label>
                <select
                  value={content.category}
                  onChange={e => setContent({ ...content, category: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="actualite">Actualité</option>
                  <option value="communique">Communiqué</option>
                  <option value="evenement">Évènement</option>
                </select>
              </div>
              <div className="flex-1 p-6 bg-slate-900 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Statut</label>
                <select
                  value={content.status}
                  onChange={e => setContent({ ...content, status: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="draft">Brouillon (Draft)</option>
                  <option value="published">Publié (Published)</option>
                </select>
              </div>
              <div className="flex-1 p-6 bg-slate-900 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Date de publication</label>
                <input 
                  type="date"
                  value={content.publishedAt?.substring(0, 10) || ''}
                  onChange={e => setContent({ ...content, publishedAt: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Extrait */}
            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl relative group">
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-sky-500 uppercase tracking-widest">
                  <FileText className="w-3 h-3" /> Extrait court (Excerpt)
                </label>
                <button 
                  onClick={() => autoTranslate('excerpt')}
                  disabled={translating}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-indigo-500/20 disabled:opacity-50"
                  title="Générer les traductions automatiques (Ar, En, Es) à partir du texte actuel"
                >
                  <Wand2 className={`w-3 h-3 ${translating ? 'animate-pulse' : ''}`} />
                  Traduire IA
                </button>
              </div>
              <textarea 
                value={content.excerpt?.[activeLang] || ''}
                onChange={e => setLocalizedValue('excerpt', e.target.value)}
                className="w-full bg-transparent text-slate-300 min-h-[80px] outline-none resize-y"
                placeholder="Un résumé rapide de 2 phrases..."
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Corps du texte */}
            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl relative">
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <FileText className="w-3 h-3" /> Corps de l'article (Body)
                </label>
                <button 
                  onClick={() => autoTranslate('body')}
                  disabled={translating}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-indigo-500/20 disabled:opacity-50"
                  title="Traduire l'intégralité de l'article pour toutes les langues"
                >
                  <Wand2 className={`w-3 h-3 ${translating ? 'animate-pulse' : ''}`} />
                  Traduire IA
                </button>
              </div>
              <textarea 
                value={content.body?.[activeLang] || ''}
                onChange={e => setLocalizedValue('body', e.target.value)}
                className="w-full bg-transparent font-sans text-lg text-slate-300 min-h-[400px] outline-none resize-y leading-relaxed"
                placeholder="Rédigez votre article ici..."
                dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Media */}
            <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl">
              <label className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">
                <ImageIcon className="w-3 h-3" /> Image de Couverture
              </label>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                <label className="flex-shrink-0 relative cursor-pointer group">
                  <div className="flex items-center gap-2 px-6 py-3 bg-slate-950 border border-white/10 rounded-xl hover:bg-slate-800 transition-colors">
                    {uploadingImage ? <RefreshCw className="w-4 h-4 animate-spin text-sky-500" /> : <ImageIcon className="w-4 h-4 text-sky-500" />}
                    <span className="text-sm font-bold text-white whitespace-nowrap">
                      {uploadingImage ? 'Téléchargement...' : 'Uploader une image'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={uploadingImage}
                  />
                </label>
                <div className="w-full relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-500 uppercase">ou URL:</span>
                  </div>
                  <input 
                    type="text"
                    value={content.coverImage || ''}
                    onChange={e => setContent({ ...content, coverImage: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/5 text-slate-300 pl-20 pr-4 py-3 rounded-xl outline-none focus:border-sky-500 transition-colors text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {content.coverImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative h-64 bg-slate-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={content.coverImage} alt="Cover Preview" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>
            {/* Spacer */}
            <div className="h-20" />
          </div>
        </main>
      </div>
    </div>
  );
}
