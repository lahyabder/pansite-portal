'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getContentById, updateContent } from '@pan/shared';
import { slugify } from '@pan/shared';
import type { ContentCategory } from '@pan/shared';
import Link from 'next/link';
import { RequirePermission, useAuth } from '@/lib/auth';

export default function EditContentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { session } = useAuth();
    const content = getContentById(id);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState(() => {
        if (!content) return null;
        return {
            titleFr: content.title.fr,
            excerptFr: content.excerpt.fr,
            bodyFr: content.body.fr,
            category: content.category,
            tags: content.tags.join(', '),
            priority: content.priority || 'normal',
            eventDate: content.eventDate || '',
            eventEndDate: content.eventEndDate || '',
            eventLocation: content.eventLocation || '',
            expiresAt: content.expiresAt || '',
        };
    });

    if (!content || !form) {
        return (
            <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-admin-text">Contenu introuvable</h2>
                <Link href="/contents" className="text-admin-primary text-sm mt-4 inline-block">← Retour</Link>
            </div>
        );
    }

    const handleSave = () => {
        setSaving(true);
        updateContent(id, {
            slug: slugify(form.titleFr),
            title: { fr: form.titleFr, ar: form.titleFr, en: form.titleFr, es: form.titleFr },
            excerpt: { fr: form.excerptFr, ar: form.excerptFr, en: form.excerptFr, es: form.excerptFr },
            body: { fr: form.bodyFr, ar: form.bodyFr, en: form.bodyFr, es: form.bodyFr },
            category: form.category as ContentCategory,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            priority: form.priority as 'normal' | 'important' | 'urgent',
            eventDate: form.eventDate || undefined,
            eventEndDate: form.eventEndDate || undefined,
            eventLocation: form.eventLocation || undefined,
            expiresAt: form.expiresAt || undefined,
        }, session?.user.id || 'system');
        setTimeout(() => router.push('/contents'), 300);
    };

    const inputClass = 'w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all';

    const statusLabels: Record<string, string> = {
        draft: '🟡 Brouillon',
        pending_approval: '🟠 En révision',
        published: '🟢 Publié',
        archived: '🔴 Archivé',
    };

    return (
        <RequirePermission module="content" action="edit">
            <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/contents" className="text-admin-text-muted text-sm hover:text-admin-text transition-colors">
                            ← Retour aux contenus
                        </Link>
                        <h2 className="text-xl font-bold text-admin-text mt-2">Modifier le contenu</h2>
                        <div className="text-admin-text-muted text-xs mt-1">
                            ID: {content.id} · Statut: {statusLabels[content.status]}
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.titleFr.trim()}
                        className="px-5 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 disabled:opacity-40 transition-colors"
                    >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>

                {/* Meta */}
                <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                    <h3 className="text-admin-text font-semibold mb-5">Type & Métadonnées</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Catégorie</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ContentCategory })} className={inputClass}>
                                <option value="actualite">📰 Actualité</option>
                                <option value="communique">📢 Communiqué</option>
                                <option value="evenement">📅 Événement</option>
                                <option value="alerte">⚠️ Alerte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Priorité</label>
                            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'normal' | 'important' | 'urgent' })} className={inputClass}>
                                <option value="normal">Normal</option>
                                <option value="important">⚡ Important</option>
                                <option value="urgent">🚨 Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Tags</label>
                            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* French */}
                <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                    <h3 className="text-admin-text font-semibold mb-5">🇫🇷 Contenu français</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Titre</label>
                            <input type="text" value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Extrait</label>
                            <textarea rows={2} value={form.excerptFr} onChange={(e) => setForm({ ...form, excerptFr: e.target.value })} className={inputClass + ' resize-none'} />
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Corps</label>
                            <textarea rows={8} value={form.bodyFr} onChange={(e) => setForm({ ...form, bodyFr: e.target.value })} className={inputClass + ' resize-none'} />
                        </div>
                    </div>
                </div>

            </div>
        </RequirePermission>
    );
}
