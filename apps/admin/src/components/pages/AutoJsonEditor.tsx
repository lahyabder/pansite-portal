'use client';

import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface AutoJsonEditorProps {
  label: string;
  value: any;
  onChange: (val: any) => void;
  activeLang: string;
  depth?: number;
}

export function AutoJsonEditor({ label, value, onChange, activeLang, depth = 0 }: AutoJsonEditorProps) {
  const [isExpanded, setIsExpanded] = React.useState(depth < 2);

  // Helper to detect a translation object
  const isTranslation = (obj: any) => {
    return obj && typeof obj === 'object' && ('fr' in obj || 'ar' in obj || 'en' in obj || 'es' in obj);
  };

  if (value === null || value === undefined) return null;

  // Handle Translation Object (Leaf Node)
  if (isTranslation(value)) {
    const isImage = typeof value[activeLang] === 'string' && (value[activeLang].includes('.jpg') || value[activeLang].includes('.png') || value[activeLang].includes('/images/'));
    const isLongText = typeof value[activeLang] === 'string' && value[activeLang].length > 60;
    
    return (
      <div className="mb-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          {label.replace(/_/g, ' ')}
        </label>
        {isImage ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={value[activeLang] || ''}
              onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-sky-400 outline-none"
            />
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-white/5">
                <ImageIcon className="w-4 h-4 text-sky-500" />
            </div>
          </div>
        ) : isLongText ? (
          <textarea
            value={value[activeLang] || ''}
            onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
            className="w-full min-h-[100px] bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/50 transition-colors"
          />
        ) : (
          <input
            type="text"
            value={value[activeLang] || ''}
            onChange={(e) => onChange({ ...value, [activeLang]: e.target.value })}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500/50 transition-colors"
          />
        )}
      </div>
    );
  }

  // Handle Primitive String (some properties like icon/slug might not be translated)
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <div className="mb-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          {label.replace(/_/g, ' ')}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none"
        />
      </div>
    );
  }

  // Handle Array
  if (Array.isArray(value)) {
    return (
      <div className={`mb-6 p-4 rounded-2xl border ${depth === 0 ? 'border-sky-500/20 bg-sky-500/[0.02]' : 'border-white/5 bg-black/20'}`}>
        <div 
          className="flex items-center justify-between cursor-pointer select-none mb-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h4 className="text-xs font-bold text-sky-400 flex items-center gap-2 uppercase tracking-widest">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Liste: {label.replace(/_/g, ' ')} ({value.length})
          </h4>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const proto = value.length > 0 ? JSON.parse(JSON.stringify(value[0])) : { fr: '' };
              // Clear the prototype values
              const clearObj = (o: any) => {
                if(isTranslation(o)) return { fr: '', ar: '', en: '', es: '' };
                if(typeof o === 'string') return '';
                if(Array.isArray(o)) return [];
                if(typeof o === 'object') {
                  const res: any = {};
                  for(let k in o) res[k] = clearObj(o[k]);
                  return res;
                }
                return o;
              }
              onChange([...value, clearObj(proto)]);
              setIsExpanded(true);
            }}
            className="p-1 px-3 bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
          >
            <Plus className="w-3 h-3" /> Ajouter
          </button>
        </div>
        
        {isExpanded && (
          <div className="space-y-4">
            {value.map((item, idx) => (
              <div key={idx} className="relative p-4 border border-white/5 bg-slate-950/50 rounded-xl group/item">
                <button 
                  onClick={() => {
                    const next = [...value];
                    next.splice(idx, 1);
                    onChange(next);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 opacity-0 group-hover/item:opacity-100 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="pr-8">
                  <AutoJsonEditor 
                    label={`Élément #${idx + 1}`} 
                    value={item} 
                    onChange={(val) => {
                      const next = [...value];
                      next[idx] = val;
                      onChange(next);
                    }} 
                    activeLang={activeLang} 
                    depth={depth + 1} 
                  />
                </div>
              </div>
            ))}
            {value.length === 0 && (
              <div className="text-center p-4 border border-dashed border-white/10 rounded-xl text-slate-500 text-xs">
                La liste est vide.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle Object
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    // If it's a structural wrapper without actual data just skip wrapper visually? No, render it as section.
    return (
      <div className={`mb-6 p-4 rounded-2xl border ${depth === 0 ? 'border-pan-gold/20 bg-pan-gold/[0.02]' : 'border-white/5 bg-black/20'}`}>
         <div 
          className="flex items-center gap-2 cursor-pointer select-none mb-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <h4 className={`text-xs font-bold uppercase tracking-widest ${depth === 0 ? 'text-pan-gold' : 'text-slate-300'}`}>
            Section: {label.replace(/_/g, ' ')}
          </h4>
        </div>
        
        {isExpanded && (
          <div className="pl-4 border-l-2 border-white/5 ml-2 space-y-4">
            {keys.map((k) => (
              <AutoJsonEditor 
                key={k} 
                label={k} 
                value={value[k]} 
                onChange={(val) => onChange({ ...value, [k]: val })} 
                activeLang={activeLang} 
                depth={depth + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
