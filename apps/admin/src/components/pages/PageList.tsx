'use client';

import { 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  Pencil, 
  Trash2, 
  Globe,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllPagesAction, deletePageAction } from '@/app/actions';
import { formatDate } from '@pan/shared';
import Link from 'next/link';

export default function PageList() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await getAllPagesAction();
    setPages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    await deletePageAction(id);
    load();
  };

  const filtered = pages.filter(p => 
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    JSON.stringify(p.title).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search pages..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm focus:border-sky-500/50 transition-all outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link 
            href="/pages/create"
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-sm hover:bg-sky-400 transition-all"
          >
            <Plus className="w-4 h-4" />
            Créer une Page
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Titre & Slug</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Dernière Modif</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">Loading pages hub...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">No pages found.</td>
              </tr>
            ) : filtered.map((page) => (
              <tr key={page.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{page.title?.fr || page.slug}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">/{page.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    page.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm text-slate-400 font-medium">{formatDate(page.updated_at)}</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a 
                      href={`https://pan.afrikyia.com/fr/${page.slug === 'home' ? '' : page.slug}`} 
                      target="_blank"
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-sky-400 transition-colors"
                      title="Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link 
                      href={`/pages/${page.id}/edit`}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(page.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
