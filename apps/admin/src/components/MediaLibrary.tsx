'use client';

import { useState, useEffect, useTransition } from 'react';
import { getAllMediaAction, createMediaAssetAction } from '@/app/actions';
import { uploadMediaAction, deleteMediaAction } from '@/app/media-actions';
import { useRouter } from 'next/navigation';
import { 
    Plus, Search, Trash2, Image as ImageIcon, 
    FileText, Video, MoreVertical, Download, 
    Link as LinkIcon, Check, X, RefreshCw, UploadCloud,
    Filter
} from 'lucide-react';
import type { MediaAsset } from '@pan/shared';

export default function MediaLibrary() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const data = await getAllMediaAction(filterType === 'all' ? undefined : { type: filterType });
            setAssets(data || []);
        } catch (err) {
            console.error('Failed to load media:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedia();
    }, [filterType]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        const formData = new FormData();
        Array.from(e.target.files).forEach(file => formData.append('files', file));
        
        try {
            await uploadMediaAction(formData);
            await loadMedia();
        } catch (err) {
            alert('Erreur lors de l\'upload');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (asset: MediaAsset) => {
        try {
            await deleteMediaAction(asset.id, asset.url);
            setAssets(prev => prev.filter(a => a.id !== asset.id));
            if (selectedAsset?.id === asset.id) setSelectedAsset(null);
            setConfirmDelete(null);
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredAssets = assets.filter(asset => 
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-pan-navy">Médiathèque</h1>
                    <p className="text-sm text-pan-gray-400 mt-1">Gérez vos images, vidéos et documents</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-pan-navy text-white rounded-xl font-semibold text-sm hover:bg-pan-blue transition-all shadow-sm hover:shadow-md">
                    <Plus className="w-4 h-4" />
                    Ajouter des fichiers
                    <input type="file" multiple className="hidden" onChange={handleUpload} disabled={isUploading} />
                </label>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pan-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un fichier..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-pan-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pan-sky/20 focus:border-pan-sky transition-all"
                    />
                </div>

                <div className="flex bg-pan-gray-50 rounded-xl p-1">
                    {['all', 'image', 'video', 'document'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filterType === type ? 'bg-white text-pan-navy shadow-sm' : 'text-pan-gray-400 hover:text-pan-gray-600'}`}
                        >
                            {type === 'all' ? 'Tout' : type === 'image' ? 'Images' : type === 'video' ? 'Vidéos' : 'Docs'}
                        </button>
                    ))}
                </div>

                <button onClick={loadMedia} className="p-2.5 border border-pan-gray-200 rounded-xl text-pan-gray-500 hover:text-pan-navy">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading && assets.length === 0 ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-pan-gray-100 rounded-2xl animate-pulse" />
                    ))
                ) : filteredAssets.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-4xl mb-4">🖼️</div>
                        <p className="text-pan-gray-400">Aucun fichier trouvé</p>
                    </div>
                ) : (
                    filteredAssets.map(asset => (
                        <div 
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className={`group relative aspect-square rounded-2xl border-2 overflow-hidden cursor-pointer transition-all ${selectedAsset?.id === asset.id ? 'border-pan-sky bg-pan-sky/5 shadow-lg' : 'border-pan-gray-100 hover:border-pan-sky/50'}`}
                        >
                            {asset.type === 'image' ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-center flex-col items-center justify-center bg-pan-gray-50 text-pan-gray-400">
                                    {asset.type === 'video' ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                    <span className="text-[10px] mt-2 px-2 text-center line-clamp-2">{asset.filename}</span>
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.url); }} className="p-2 bg-white rounded-lg text-pan-navy hover:bg-pan-gold">
                                    <LinkIcon className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(asset.id); }} className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {confirmDelete === asset.id && (
                                <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center p-2 text-white text-center">
                                    <p className="text-[10px] font-bold mb-2">Supprimer définitivement ?</p>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(asset); }} className="p-1 px-3 bg-white text-red-600 rounded text-[10px] font-bold">OUI</button>
                                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }} className="p-1 px-3 bg-red-400 text-white rounded text-[10px] font-bold">NON</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Selection Sidebar/Modal */}
            {selectedAsset && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-pan-gray-100 p-6 z-50 animate-in slide-in-from-right">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-pan-navy">Détails du fichier</h3>
                        <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-pan-gray-50 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="aspect-square bg-pan-gray-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-pan-gray-100">
                        {selectedAsset.type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedAsset.url} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                            selectedAsset.type === 'video' ? <Video className="w-16 h-16 text-pan-gray-300" /> : <FileText className="w-16 h-16 text-pan-gray-300" />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-pan-gray-400 uppercase tracking-wider">Nom du fichier</label>
                            <p className="text-sm font-semibold text-pan-navy break-all">{selectedAsset.filename}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-pan-gray-400 uppercase tracking-wider">Taille</label>
                            <p className="text-sm font-semibold text-pan-navy">{(selectedAsset.size / 1024 / 1024).toFixed(2)} Mo</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-pan-gray-400 uppercase tracking-wider">Type</label>
                            <p className="text-sm font-semibold text-pan-navy uppercase">{selectedAsset.mimeType}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-pan-gray-400 uppercase tracking-wider">Lien public</label>
                            <div className="flex gap-2 mt-1">
                                <input readOnly value={selectedAsset.url} className="flex-1 text-[10px] bg-pan-gray-50 p-2 rounded-lg border border-pan-gray-100 focus:outline-none" />
                                <button onClick={() => copyToClipboard(selectedAsset.url)} className="p-2 bg-pan-navy text-white rounded-lg hover:bg-pan-blue">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setConfirmDelete(selectedAsset.id)}
                        className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Supprimer le fichier
                    </button>
                </div>
            )}
        </div>
    );
}
