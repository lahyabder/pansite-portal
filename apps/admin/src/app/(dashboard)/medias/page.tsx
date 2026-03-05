import { RequirePermission } from '@/lib/auth';

export default function MediasPage() {
    const placeholderMedia = [
        { name: 'port-vue-aerienne.jpg', size: '2.4 MB', date: '15 Fév 2025' },
        { name: 'quai-mineralier.jpg', size: '1.8 MB', date: '10 Fév 2025' },
        { name: 'ceremonies-inauguration.jpg', size: '3.1 MB', date: '5 Fév 2025' },
        { name: 'flotte-remorqueurs.jpg', size: '2.0 MB', date: '1 Fév 2025' },
        { name: 'zone-franche-panorama.jpg', size: '4.2 MB', date: '28 Jan 2025' },
        { name: 'port-coucher-soleil.jpg', size: '1.5 MB', date: '20 Jan 2025' },
    ];

    return (
        <RequirePermission module="content">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-admin-text">Médiathèque</h2>
                        <p className="text-admin-text-muted text-sm mt-1">Photos, vidéos et fichiers médias.</p>
                    </div>
                    <button className="px-4 py-2.5 bg-admin-primary text-white text-sm font-medium rounded-xl hover:bg-admin-primary/80 transition-colors">
                        + Uploader
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {placeholderMedia.map((media) => (
                        <div key={media.name} className="bg-admin-surface rounded-xl border border-admin-border overflow-hidden hover:border-admin-primary/30 transition-colors group">
                            <div className="aspect-[4/3] bg-admin-surface-alt flex items-center justify-center">
                                <svg className="w-10 h-10 text-admin-text-muted/30 group-hover:text-admin-primary/40 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                </svg>
                            </div>
                            <div className="p-3">
                                <div className="text-admin-text text-xs font-medium truncate">{media.name}</div>
                                <div className="text-admin-text-muted text-[10px] mt-1">{media.size} · {media.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </RequirePermission>
    );
}
