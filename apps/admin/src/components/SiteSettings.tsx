import { 
  Settings, 
  Save, 
  RefreshCw, 
  Globe, 
  Check, 
  Layout, 
  Camera, 
  Share2, 
  Mail, 
  Phone, 
  MapPin,
  Trash2,
  Plus
} from 'lucide-react';
import { getSettingsAction, updateSettingsAction } from '@/app/actions';

export default function SiteSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getSettingsAction();
    setSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettingsAction(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-600 gap-4">
      <RefreshCw className="w-10 h-10 animate-spin" />
      <p className="font-bold">Loading global parameters...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-black text-white">Paramètres Globaux</h1>
          <p className="text-slate-400 mt-2 font-medium">Configurez l'identité visuelle et les métadonnées de votre écosystème.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
            saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-950 shadow-white/10 hover:scale-105'
          }`}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Sauvegarder la Configuration'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* Section 1: Branding */}
           <section className="glass-card rounded-[2.5rem] p-10 space-y-8">
              <div className="flex items-center gap-4 text-sky-400">
                 <Layout className="w-6 h-6" />
                 <h2 className="text-xl font-bold text-white">Identité & Branding</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom du Site (FR)</label>
                    <input 
                      type="text" 
                      value={settings.siteName?.fr || ''}
                      onChange={e => setSettings({...settings, siteName: {...settings.siteName, fr: e.target.value}})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all font-medium"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slogan (FR)</label>
                    <input 
                      type="text" 
                      value={settings.slogan?.fr || ''}
                      onChange={e => setSettings({...settings, slogan: {...settings.slogan, fr: e.target.value}})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all font-medium"
                    />
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 grid md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Principal (URL)</label>
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                          {settings.logo ? <img src={settings.logo} className="w-full h-full object-contain" /> : <Camera className="w-6 h-6 text-slate-800" />}
                       </div>
                       <input 
                         type="text" 
                         value={settings.logo || ''}
                         onChange={e => setSettings({...settings, logo: e.target.value})}
                         className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-mono text-sky-400 outline-none"
                       />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Favicon (URL)</label>
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center p-2 shrink-0">
                          {settings.favicon ? <img src={settings.favicon} className="w-8 h-8 object-contain" /> : <Globe className="w-6 h-6 text-slate-800" />}
                       </div>
                       <input 
                         type="text" 
                         value={settings.favicon || ''}
                         onChange={e => setSettings({...settings, favicon: e.target.value})}
                         className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-mono text-sky-400 outline-none"
                       />
                    </div>
                 </div>
              </div>
           </section>

           {/* Section 2: Contact */}
           <section className="glass-card rounded-[2.5rem] p-10 space-y-8">
              <div className="flex items-center gap-4 text-emerald-400">
                 <Mail className="w-6 h-6" />
                 <h2 className="text-xl font-bold text-white">Coordonnées & Contact</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Téléphones </label>
                    <div className="space-y-2">
                       {settings.contactPhones?.map((phone: string, i: number) => (
                         <div key={i} className="flex gap-2">
                            <input 
                              type="text" 
                              value={phone} 
                              onChange={e => {
                                 const next = [...settings.contactPhones];
                                 next[i] = e.target.value;
                                 setSettings({...settings, contactPhones: next});
                              }}
                              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none"
                            />
                            <button onClick={() => setSettings({...settings, contactPhones: settings.contactPhones.filter((_:any,idx:any)=>idx!==i)})} className="p-2 text-slate-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       ))}
                       <button onClick={() => setSettings({...settings, contactPhones: [...(settings.contactPhones || []), '']})} className="text-[10px] font-bold text-sky-500 hover:text-sky-400 flex items-center gap-1"><Plus className="w-3 h-3" /> Ajouter</button>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> E-mails </label>
                    <div className="space-y-2">
                       {settings.contactEmails?.map((email: string, i: number) => (
                         <div key={i} className="flex gap-2">
                            <input 
                              type="text" 
                              value={email} 
                              onChange={e => {
                                 const next = [...settings.contactEmails];
                                 next[i] = e.target.value;
                                 setSettings({...settings, contactEmails: next});
                              }}
                              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none"
                            />
                            <button onClick={() => setSettings({...settings, contactEmails: settings.contactEmails.filter((_:any,idx:any)=>idx!==i)})} className="p-2 text-slate-700 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       ))}
                       <button onClick={() => setSettings({...settings, contactEmails: [...(settings.contactEmails || []), '']})} className="text-[10px] font-bold text-sky-500 hover:text-sky-400 flex items-center gap-1"><Plus className="w-3 h-3" /> Ajouter</button>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> Adresse Physique (FR)</label>
                 <textarea 
                    value={settings.address?.fr || ''}
                    onChange={e => setSettings({...settings, address: {...settings.address, fr: e.target.value}})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-all font-medium min-h-[100px]"
                 />
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <section className="glass-card rounded-[2.5rem] p-10 space-y-8">
              <div className="flex items-center gap-4 text-amber-500">
                 <Share2 className="w-6 h-6" />
                 <h2 className="text-xl font-bold text-white">Réseaux Sociaux</h2>
              </div>
              <div className="space-y-6">
                {['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'].map(network => (
                  <div key={network} className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{network}</label>
                     <input 
                       type="text" 
                       value={settings.socialLinks?.[network] || ''}
                       onChange={e => setSettings({...settings, socialLinks: {...settings.socialLinks, [network]: e.target.value}})}
                       placeholder={`URL ${network}...`}
                       className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-mono text-slate-400 outline-none focus:border-sky-500/50"
                     />
                  </div>
                ))}
              </div>
           </section>

           <div className="glass-card rounded-[2.5rem] p-10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-center">
              <div className="w-20 h-20 bg-indigo-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6">
                 <Settings className="text-white w-10 h-10 animate-[spin_10s_linear_infinite]" />
              </div>
              <h3 className="text-xl font-black text-white">Mode Développeur</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">Certaines options avancées (JSON, API, Webhooks) sont configurées automatiquement par le système.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
