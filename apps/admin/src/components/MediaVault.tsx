'use client';

import { 
  ImageIcon, 
  Upload, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Info,
  Check,
  RefreshCw,
  FileText,
  FolderOpen
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getAllMediaAction, deleteMediaAction, getMediaUploadUrlAction, saveMediaMetadataAction } from '@/app/actions';
import { formatDate } from '@pan/shared';

export default function MediaVault() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const data = await getAllMediaAction();
    setMedia(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous supprimer ce média ?')) return;
    await deleteMediaAction(id);
    setSelected(null);
    load();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    const newAssets: any[] = [];
    
    for (const file of files) {
      try {
        const metadata = await getMediaUploadUrlAction(file.name, file.type, file.size);
        
        if (!metadata.signedUrl) throw new Error("Impossible d'obtenir l'URL d'upload");

        const res = await fetch(metadata.signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          }
        });

        if (!res.ok) {
           throw new Error("Le stockage a rejeté le fichier");
        }
        
        const asset = await saveMediaMetadataAction(metadata);
        newAssets.push(asset);
        successCount++;
      } catch (error: any) {
        console.error(`Erreur pour ${file.name}:`, error);
        alert(`Échec pour ${file.name} : ` + error.message);
      }
    }

    if (newAssets.length > 0) {
      setMedia(prev => [...newAssets, ...prev]);
    }
    
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filtered = media.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 h-[calc(100vh-160px)] flex flex-col -m-8">
      {/* ─── Media Header ─── */}
      <header className="h-20 glass border-0 border-b border-white/5 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="font-outfit text-2xl font-black text-white">Médiathèque</h1>
          <div className="h-8 w-[1px] bg-white/5"></div>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <input 
              type="text" 
              placeholder="Rechercher un média..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-sky-500/50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept="image/*,video/*"
              multiple
           />
           <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`flex items-center gap-2 px-6 py-2.5 ${uploading ? 'bg-sky-500/50 cursor-not-allowed' : 'bg-sky-500 hover:scale-105 active:scale-95'} text-white rounded-xl font-black text-sm transition-all shadow-xl shadow-sky-500/10`}
           >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Envoi...' : 'Ajouter un Fichier'}
           </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* ─── Assets Grid ─── */}
        <main className="flex-1 p-8 overflow-y-auto">
          {loading && media.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
               <RefreshCw className="w-10 h-10 animate-spin" />
               <p className="font-bold">Chargement de la médiathèque...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700">
               <ImageIcon className="w-20 h-20 mb-6 opacity-10" />
               <p className="font-bold">Aucun média trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filtered.map(asset => (
                <div 
                  key={asset.id} 
                  className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all border-4 ${
                    selected?.id === asset.id ? 'border-sky-500 scale-95 shadow-2xl' : 'border-transparent bg-slate-900'
                  }`}
                >
                  {/* Click area for selection */}
                  <div className="absolute inset-0 z-10" onClick={() => setSelected(asset)}></div>

                  {/* Delete Button (Floating) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset.id);
                    }}
                    className="absolute top-3 right-3 z-20 p-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl backdrop-blur opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 hover:scale-110 shadow-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {asset.type === 'image' ? (
                    <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                       <FileText className="w-10 h-10 text-slate-700" />
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">{asset.filename.split('.').pop()}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 pointer-events-none">
                     <p className="text-[10px] font-bold text-white truncate">{asset.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ─── Details Sidebar ─── */}
        <aside className={`w-[360px] border-l border-white/5 bg-slate-950/50 p-8 transition-transform ${
          selected ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {selected ? (
            <div className="space-y-8 animate-fade-in">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
                {selected.type === 'image' ? (
                  <img src={selected.url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText className="w-20 h-20 text-slate-800" /></div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white break-all">{selected.filename}</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">{selected.type} • {(selected.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">URL Publique</label>
                  <div className="flex gap-2">
                    <input readOnly value={selected.url} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[10px] font-mono text-sky-400 outline-none" />
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors" title="Copy"><RefreshCw className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Date d'Ajout</label>
                  <p className="text-sm font-bold text-slate-300">{formatDate(selected.created_at, 'fr')}</p>
                </div>
              </div>

              <div className="pt-8 flex gap-3">
                <a 
                  href={selected.url} 
                  download 
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white font-bold text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </a>
                <button 
                  onClick={() => handleDelete(selected.id)}
                  className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 text-center">
               <Info className="w-12 h-12 mb-4 opacity-10" />
               <p className="text-sm font-bold opacity-20">Sélectionnez un fichier pour voir les détails et les options.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
