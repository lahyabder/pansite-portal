export const dynamic = 'force-dynamic';

import { 
    getAllContentsAction, 
    getAuditLogAction, 
    getAllPagesAction, 
    getAllMenusAction, 
    getAllMediaAction 
} from '@/app/actions';
import { formatDate } from '@pan/shared';
import type { Content, Page, Menu, MediaAsset } from '@pan/shared';
import Link from 'next/link';

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

const categoryLabels: Record<string, { label: string; color: string }> = {
    actualite:    { label: 'Actualité',         color: 'bg-blue-100 text-blue-700' },
    communique:   { label: 'Communiqué',        color: 'bg-purple-100 text-purple-700' },
    evenement:    { label: 'Événement',         color: 'bg-emerald-100 text-emerald-700' },
    alerte:       { label: 'Alerte',            color: 'bg-amber-100 text-amber-700' },
    'le-port':    { label: 'Le Port',           color: 'bg-pan-sky/10 text-pan-navy' },
    infrastructure:{ label: 'Infrastructures', color: 'bg-pan-gold/20 text-pan-navy' },
    services:     { label: 'Services',          color: 'bg-teal-100 text-teal-700' },
    procedures:   { label: 'Procédures',        color: 'bg-indigo-100 text-indigo-700' },
    tariffs:      { label: 'Tarifs',            color: 'bg-lime-100 text-lime-700' },
    tenders:      { label: 'Appel d\'offres',   color: 'bg-orange-100 text-orange-700' },
    media:        { label: 'Médiathèque',       color: 'bg-pink-100 text-pink-700' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
    draft:      { label: 'Brouillon',  color: 'bg-gray-100 text-gray-600' },
    pending:    { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
    published:  { label: 'Publié',     color: 'bg-green-100 text-green-700' },
    archived:   { label: 'Archivé',    color: 'bg-red-100 text-red-600' },
};

function StatCard({ title, value, sub, color, icon }: { title: string; value: number | string; sub?: string; color: string; icon: string }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pan-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-pan-navy mb-1">{value}</p>
            <p className="text-sm font-semibold text-pan-gray-700">{title}</p>
            {sub && <p className="text-xs text-pan-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

export default async function DashboardPage() {
    const [allData, pagesData, menusData, mediaData] = await Promise.all([
        getAllContentsAction(),
        getAllPagesAction(),
        getAllMenusAction(),
        getAllMediaAction()
    ]);

    const contents = (allData?.items || []) as Content[];
    const totalCount      = allData?.total ?? 0;
    const publishedCount  = contents.filter(c => c.status === 'published').length;
    const draftCount      = contents.filter(c => c.status === 'draft').length;
    const pendingCount    = contents.filter(c => c.status === 'pending_approval').length;
    const tendersCount    = contents.filter(c => c.category === 'tenders').length;
    const newsCount       = contents.filter(c => c.category === 'actualite').length;

    const pagesCount = (pagesData || []).length;
    const menusCount = (menusData || []).length;
    const mediaCount = (mediaData || []).length;

    const recentItems = [...contents]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
        .slice(0, 8);

    return (
        <div className="space-y-8">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-pan-navy to-pan-blue rounded-2xl p-6 text-white flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Bienvenue dans votre Back-Office</h2>
                    <p className="text-pan-light/80 text-sm">Port Autonome de Nouadhibou · Système de gestion de contenu v2.0</p>
                </div>
                <div className="text-5xl opacity-20 select-none">⚓</div>
            </div>

            {/* Stats grid */}
            <div className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard title="Total contenus"    value={totalCount}     icon="📋" color="bg-pan-navy/10" />
                    <StatCard title="Publiés"           value={publishedCount} icon="✅" color="bg-green-100"   sub="En ligne sur le site" />
                    <StatCard title="Brouillons"        value={draftCount}     icon="📝" color="bg-gray-100"    sub="En attente d'édition" />
                    <StatCard title="En révision"       value={pendingCount}   icon="🔍" color="bg-amber-100"   sub="À valider / publier" />
                    <StatCard title="Actualités"        value={newsCount}      icon="📰" color="bg-blue-100" />
                    <StatCard title="Appels d'offres"   value={tendersCount}   icon="📦" color="bg-orange-100" />
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <StatCard title="Pages CMS"         value={pagesCount}     icon="📄" color="bg-pan-sky/10" sub="Pages administrables" />
                    <StatCard title="Menus"             value={menusCount}     icon="🗺️" color="bg-indigo-100"  sub="Navigation dynamique" />
                    <StatCard title="Médiathèque"       value={mediaCount}     icon="🖼️" color="bg-pink-100"   sub="Images & documents" />
                    <StatCard title="Alertes actives"   value={contents.filter(c => c.category === 'alerte' && c.status === 'published').length} icon="🔔" color="bg-red-100" />
                </div>
            </div>

            {/* Pending review alert */}
            {pendingCount > 0 && (
                <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-semibold text-amber-800">{pendingCount} élément(s) en attente de validation</p>
                        <p className="text-amber-600 text-sm">Ces contenus ont été soumis et attendent d'être publiés ou rejetés.</p>
                    </div>
                    <Link href="/news" className="ml-auto px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-colors whitespace-nowrap">Voir les contenus</Link>
                </div>
            )}

            {/* Recent content */}
            <div className="bg-white rounded-2xl shadow-sm border border-pan-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-pan-gray-100">
                    <h3 className="text-base font-bold text-pan-navy">Derniers contenus</h3>
                    <Link href="/news" className="text-pan-sky text-sm font-bold hover:underline">Voir tout →</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-pan-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Titre</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-pan-gray-400 uppercase tracking-wider">Dernière MàJ</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pan-gray-50">
                            {recentItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-pan-gray-400 text-sm">Aucun contenu trouvé</td>
                                </tr>
                            )}
                            {recentItems.map(item => {
                                const fr = typeof item.title === 'object' ? (item.title as any).fr : item.title;
                                const cat = categoryLabels[item.category] || { label: item.category, color: 'bg-pan-gray-100 text-pan-gray-600' };
                                const st  = statusLabels[item.status]   || { label: item.status,    color: 'bg-pan-gray-100 text-pan-gray-600' };
                                const date = item.updatedAt || item.createdAt;
                                return (
                                    <tr key={item.id} className="hover:bg-pan-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-pan-navy line-clamp-2">{fr || '—'}</p>
                                            <p className="text-xs text-pan-gray-400 mt-0.5 truncate max-w-sm">{item.slug}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${cat.color}`}>{cat.label}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-pan-gray-400">
                                            {date ? formatDate(date, 'fr') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`${getCategoryPath(item.category)}/${item.id}/edit`} className="text-xs font-bold text-pan-sky hover:text-pan-blue transition-colors">Modifier</Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}