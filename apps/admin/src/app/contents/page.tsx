import { getAdminContents, deleteContent } from '@pan/shared';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Search, FileText } from 'lucide-react';
import { formatDate } from '@pan/shared';

// Import a custom Client component for deletion logic if needed,
// but for simplicity, Server Actions handle delete. Wait, we can use a small Client Delete Button here.
// To keep it simple, we'll render the listing statically/server-side and link to actions.

export default async function ContentsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search || '';

  const data = await getAdminContents({ page, pageSize: 20, search });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white font-outfit">Actualités & Contenus</h1>
          <p className="text-slate-400 mt-2">Publiez et gérez les actualités, communiqués et événements.</p>
        </div>
        <Link 
          href="/contents/create"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          Rédiger un Article
        </Link>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Titre de l'article</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Catégorie</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date MÀJ</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500">Aucun article trouvé.</td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-sky-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white line-clamp-1">{item.title?.fr || item.slug}</p>
                        <p className="text-xs font-mono text-slate-500 mt-1">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="uppercase text-[10px] font-black text-slate-400 tracking-widest">{item.category}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'published' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-slate-400">
                    {formatDate(item.updatedAt, 'fr')}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/contents/${item.id}/edit`}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-sky-500 hover:text-white text-slate-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
