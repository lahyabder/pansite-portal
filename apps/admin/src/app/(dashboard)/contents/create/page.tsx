'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContent } from '@pan/shared';
import { slugify } from '@pan/shared';
import type { ContentCategory } from '@pan/shared';
import Link from 'next/link';
import { RequirePermission, useAuth } from '@/lib/auth';

export default function CreateContentPage() {
    const router = useRouter();
    const { session } = useAuth();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        titleFr: '',
        excerptFr: '',
        bodyFr: '',
        category: 'actualite' as ContentCategory,
        tags: '',
        priority: 'normal' as 'normal' | 'important' | 'urgent',
        eventDate: '',
        eventEndDate: '',
        eventLocation: '',
        expiresAt: '',
    });

    const handleSubmit = (asDraft: boolean) => {
        if (!form.titleFr.trim()) return;
        setSaving(true);

        const slug = slugify(form.titleFr);
        createContent({
            slug,
            title: { fr: form.titleFr, ar: form.titleFr, en: form.titleFr, es: form.titleFr },
            excerpt: { fr: form.excerptFr, ar: form.excerptFr, en: form.excerptFr, es: form.excerptFr },
            body: { fr: form.bodyFr, ar: form.bodyFr, en: form.bodyFr, es: form.bodyFr },
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
        });

        setTimeout(() => router.push('/contents'), 300);
    };

    const inputClass = 'w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all';

    return (
        <RequirePermission module="content" action="create">
            <div className="max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/contents" className="text-admin-text-muted text-sm hover:text-admin-text transition-colors">
                            ← Retour aux contenus
                        </Link>
                        <h2 className="text-xl font-bold text-admin-text mt-2">Nouveau contenu</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={saving || !form.titleFr.trim()}
                            className="px-4 py-2.5 bg-admin-surface border border-admin-border text-admin-text text-sm font-medium rounded-xl hover:bg-admin-surface-alt disabled:opacity-40 transition-colors"
                        >
                            Enregistrer brouillon
                        </button>
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={saving || !form.titleFr.trim()}
                            className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 disabled:opacity-40 transition-colors"
                        >
                            {saving ? 'Publication...' : 'Publier'}
                        </button>
                    </div>
                </div>

                {/* Type & Meta */}
                <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                    <h3 className="text-admin-text font-semibold mb-5">Type & Métadonnées</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Catégorie *</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value as ContentCategory })}
                                className={inputClass}
                            >
                                <option value="actualite">📰 Actualité</option>
                                <option value="communique">📢 Communiqué</option>
                                <option value="evenement">📅 Événement</option>
                                <option value="alerte">⚠️ Alerte / Avis</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Priorité</label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value as 'normal' | 'important' | 'urgent' })}
                                className={inputClass}
                            >
                                <option value="normal">Normal</option>
                                <option value="important">⚡ Important</option>
                                <option value="urgent">🚨 Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Tags (séparés par des virgules)</label>
                            <input
                                type="text"
                                value={form.tags}
                                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                placeholder="infrastructure, développement"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Event-specific fields */}
                    {form.category === 'evenement' && (
                        <div className="grid sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-admin-border">
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Date de début</label>
                                <input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Date de fin</label>
                                <input type="datetime-local" value={form.eventEndDate} onChange={(e) => setForm({ ...form, eventEndDate: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Lieu</label>
                                <input type="text" value={form.eventLocation} onChange={(e) => setForm({ ...form, eventLocation: e.target.value })} placeholder="Port Autonome de Nouadhibou" className={inputClass} />
                            </div>
                        </div>
                    )}

                    {/* Alert-specific fields */}
                    {form.category === 'alerte' && (
                        <div className="mt-4 pt-4 border-t border-admin-border">
                            <div className="max-w-xs">
                                <label className="block text-admin-text-muted text-sm mb-1.5">Date d&apos;expiration</label>
                                <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputClass} />
                            </div>
                        </div>
                    )}
                </div>

                {/* French content */}
                <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                    <h3 className="text-admin-text font-semibold mb-5">🇫🇷 Contenu français</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Titre *</label>
                            <input
                                type="text"
                                value={form.titleFr}
                                onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                                placeholder="Titre de l'article..."
                                className={inputClass}
                            />
                            {form.titleFr && (
                                <div className="text-admin-text-muted text-xs mt-1">Slug : {slugify(form.titleFr)}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Extrait</label>
                            <textarea
                                rows={2}
                                value={form.excerptFr}
                                onChange={(e) => setForm({ ...form, excerptFr: e.target.value })}
                                placeholder="Résumé court pour les listes..."
                                className={inputClass + ' resize-none'}
                            />
                        </div>
                        <div>
                            <label className="block text-admin-text-muted text-sm mb-1.5">Corps de l&apos;article</label>
                            <textarea
                                rows={8}
                                value={form.bodyFr}
                                onChange={(e) => setForm({ ...form, bodyFr: e.target.value })}
                                placeholder="Contenu complet de l'article..."
                                className={inputClass + ' resize-none'}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </RequirePermission>
    );
}
