'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getGedDocumentById, uploadNewVersion, formatFileSize } from '@pan/shared';
import type { DocumentFileType } from '@pan/shared';
import { RequirePermission, useAuth } from '@/lib/auth';

export default function DocumentVersionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { session, can } = useAuth();
    const [, setTick] = useState(0);
    const [showUpload, setShowUpload] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState<DocumentFileType>('pdf');
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState('');

    const doc = getGedDocumentById(id);

    if (!doc) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-admin-text">Document non trouvé</h2>
                <p className="text-admin-text-muted mt-2">Le document demandé n&apos;existe pas.</p>
            </div>
        );
    }

    function handleUpload() {
        if (!fileName.trim()) {
            alert('Le nom du fichier est requis');
            return;
        }
        uploadNewVersion(id, {
            fileName,
            fileUrl: `/storage/uploads/${id}/${fileName}`,
            fileSize: Math.floor(Math.random() * 5_000_000) + 500_000,
            fileType,
            uploadedBy: session?.user.id || 'system',
            uploadedByName: session?.user.name || 'System User',
            comment: comment || undefined,
        }, session?.user.id || 'system');

        setFileName('');
        setComment('');
        setShowUpload(false);
        setToast('Nouvelle version ajoutée ✓');
        setTick((t) => t + 1);
        setTimeout(() => setToast(''), 3000);
    }

    const inputClass = 'w-full px-4 py-2.5 bg-admin-surface border border-admin-border rounded-xl text-admin-text text-sm placeholder:text-admin-text-muted focus:outline-none focus:ring-2 focus:ring-admin-primary/30';

    return (
        <RequirePermission module="documents">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Toast */}
                {toast && (
                    <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-pulse">
                        {toast}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button onClick={() => router.push('/ged/documents')} className="text-admin-primary-light text-sm hover:underline mb-2 block">
                            ← Retour aux documents
                        </button>
                        <h2 className="text-xl font-bold text-admin-text">{doc.title.fr}</h2>
                        <p className="text-admin-text-muted text-sm mt-1">
                            {doc.reference && <span className="font-mono">{doc.reference} · </span>}
                            Version actuelle : v{doc.currentVersion} · {doc.versions.length} version(s)
                        </p>
                    </div>
                    {can('documents', 'edit') && (
                        <button
                            onClick={() => setShowUpload(!showUpload)}
                            className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors"
                        >
                            + Nouvelle version
                        </button>
                    )}
                </div>

                {/* Upload new version form */}
                {showUpload && (
                    <div className="bg-admin-surface rounded-xl border border-admin-primary/30 p-6 space-y-4">
                        <h3 className="text-admin-text font-semibold">Ajouter une nouvelle version</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-admin-text text-sm font-medium mb-1.5">Nom du fichier *</label>
                                <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="document-v2.pdf" className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-admin-text text-sm font-medium mb-1.5">Type de fichier</label>
                                <select value={fileType} onChange={(e) => setFileType(e.target.value as DocumentFileType)} className={inputClass}>
                                    <option value="pdf">PDF</option>
                                    <option value="doc">Word (doc)</option>
                                    <option value="docx">Word (docx)</option>
                                    <option value="xlsx">Excel (xlsx)</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-admin-text text-sm font-medium mb-1.5">Commentaire</label>
                                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Description des changements..." className={inputClass} />
                            </div>
                        </div>
                        {/* Mock drop zone */}
                        <div className="border-2 border-dashed border-admin-border rounded-xl p-6 text-center hover:border-admin-primary/40 transition-colors cursor-pointer">
                            <span className="text-2xl block mb-1">📤</span>
                            <span className="text-admin-text-muted text-sm">Glissez le nouveau fichier ici</span>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowUpload(false)} className="px-4 py-2 border border-admin-border text-admin-text-muted text-sm rounded-xl hover:bg-admin-surface-alt transition-colors">
                                Annuler
                            </button>
                            <button onClick={handleUpload} className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                                Téléverser la version
                            </button>
                        </div>
                    </div>
                )}

                {/* Version timeline */}
                <div className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden">
                    <div className="px-5 py-3 border-b border-admin-border">
                        <h3 className="text-admin-text font-semibold text-sm">Historique des versions</h3>
                    </div>
                    <div className="divide-y divide-admin-border/50">
                        {doc.versions.map((ver, i) => (
                            <div key={ver.id} className={`px-5 py-4 flex items-start gap-4 ${i === 0 ? 'bg-admin-primary/5' : ''}`}>
                                {/* Version badge */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${i === 0 ? 'bg-admin-primary text-white' : 'bg-admin-surface-alt text-admin-text-muted'}`}>
                                    v{ver.versionNumber}
                                </div>
                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-admin-text font-medium text-sm">{ver.fileName}</span>
                                        {i === 0 && (
                                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-semibold">
                                                Version courante
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-admin-text-muted text-xs mt-1 flex items-center gap-3 flex-wrap">
                                        <span>{formatFileSize(ver.fileSize)}</span>
                                        <span>·</span>
                                        <span>Par {ver.uploadedByName}</span>
                                        <span>·</span>
                                        <span>{new Date(ver.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    {ver.comment && (
                                        <p className="text-admin-text-muted text-xs mt-1 italic">
                                            💬 {ver.comment}
                                        </p>
                                    )}
                                </div>
                                {/* Download button */}
                                <button className="px-3 py-1.5 text-xs border border-admin-border text-admin-text-muted rounded-lg hover:bg-admin-surface-alt transition-colors shrink-0">
                                    Télécharger
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RequirePermission>
    );
}
