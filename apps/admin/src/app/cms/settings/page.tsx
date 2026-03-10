import { RequirePermission } from '@/lib/auth';

export default function SettingsPage() {
    return (
        <RequirePermission module="settings">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-admin-text">Paramètres</h2>
                    <p className="text-admin-text-muted text-sm mt-1">Configuration générale de l&apos;application.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* General settings */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h3 className="text-admin-text font-semibold mb-5">Général</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Nom du site</label>
                                <input
                                    type="text"
                                    defaultValue="Port Autonome de Nouadhibou"
                                    className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Email de contact</label>
                                <input
                                    type="email"
                                    defaultValue="contact@pan.mr"
                                    className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Téléphone</label>
                                <input
                                    type="tel"
                                    defaultValue="+222 45 74 51 06"
                                    className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO settings */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
                        <h3 className="text-admin-text font-semibold mb-5">SEO & Métadonnées</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Titre du site (FR)</label>
                                <input
                                    type="text"
                                    defaultValue="Port Autonome de Nouadhibou | PAN"
                                    className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-admin-text-muted text-sm mb-1.5">Description (FR)</label>
                                <textarea
                                    rows={3}
                                    defaultValue="Site officiel du Port Autonome de Nouadhibou"
                                    className="w-full px-4 py-2.5 bg-admin-bg border border-admin-border rounded-xl text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-admin-primary/50 focus:border-admin-primary transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maintenance */}
                    <div className="bg-admin-surface rounded-xl border border-admin-border p-6 lg:col-span-2">
                        <h3 className="text-admin-text font-semibold mb-5">Maintenance</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-admin-text text-sm font-medium">Mode maintenance</div>
                                <div className="text-admin-text-muted text-xs mt-0.5">Afficher une page de maintenance aux visiteurs.</div>
                            </div>
                            <button className="w-12 h-7 bg-admin-surface-alt rounded-full relative transition-colors">
                                <span className="absolute start-1 top-1 w-5 h-5 bg-admin-text-muted rounded-full transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="px-6 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                        Enregistrer
                    </button>
                </div>
            </div>
        </RequirePermission>
    );
}
