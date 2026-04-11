'use client';

import React, { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';

interface QuaisGridProps {
    dict: Dictionary;
    quais: any;
}

export function QuaisGrid({ dict, quais }: QuaisGridProps) {
    const [selectedQuaiIndex, setSelectedQuaiIndex] = useState<number | null>(null);

    const selectedQuai = selectedQuaiIndex !== null ? quais.items[selectedQuaiIndex] : null;

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {quais.items.map((quai: any, i: number) => (
                    <div 
                        key={i} 
                        className="group relative bg-white rounded-3xl p-1 shadow-xl shadow-pan-navy/5 hover:shadow-2xl hover:shadow-pan-navy/10 transition-all duration-500 hover:-translate-y-2 border border-pan-navy/5"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pan-navy/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative p-8 pt-10 text-right md:text-inherit" dir={quais.title === 'الأرصفة والمحطات' ? 'rtl' : 'ltr'}>
                            {/* Icon/Number */}
                            <div className={`absolute top-0 ${quais.title === 'الأرصفة والمحطات' ? 'left-8' : 'right-8'} -translate-y-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-pan-navy to-pan-blue flex items-center justify-center text-white font-bold shadow-lg shadow-pan-navy/20`}>
                                0{i + 1}
                            </div>

                            <h3 className="text-2xl font-bold text-pan-navy mb-4 group-hover:text-pan-sky transition-colors">{quai.name}</h3>
                            <p className="text-pan-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-pan-gray-700 transition-colors">{quai.info}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-pan-pale group-hover:bg-white transition-colors border border-transparent group-hover:border-pan-navy/5">
                                    <span className="text-xs font-bold text-pan-gray-400 uppercase tracking-widest">{dict.pages.infrastructure.labels.length}</span>
                                    <span className="text-lg font-black text-pan-navy">{quai.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-pan-pale group-hover:bg-white transition-colors border border-transparent group-hover:border-pan-navy/5">
                                    <span className="text-xs font-bold text-pan-gray-400 uppercase tracking-widest">{dict.pages.infrastructure.labels.draft}</span>
                                    <span className="text-lg font-black text-pan-sky">{quai.draft}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedQuaiIndex(i)}
                                className="mt-8 w-full py-4 rounded-2xl bg-pan-navy text-white text-sm font-bold uppercase tracking-widest hover:bg-pan-sky transition-all shadow-lg shadow-pan-navy/10 flex items-center justify-center gap-2 group/btn"
                            >
                                {dict.pages.infrastructure.technicalDetails}
                                <span className={`transition-transform ${quais.title === 'الأرصفة والمحطات' ? 'group-hover/btn:-translate-x-1 rotate-180' : 'group-hover/btn:translate-x-1'}`}>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Technical Details Modal */}
            {selectedQuai && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-pan-navy/60 backdrop-blur-sm" onClick={() => setSelectedQuaiIndex(null)} />
                    
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Modal Header */}
                        <div className="bg-pan-navy p-8 md:p-10 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <div className="text-8xl font-black">PAN</div>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedQuaiIndex(null)}
                                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                            >
                                ✕
                            </button>
                            
                            <div className="relative z-10" dir={quais.title === 'الأرصفة والمحطات' ? 'rtl' : 'ltr'}>
                                <span className="inline-block px-3 py-1 rounded-full bg-pan-gold/20 text-pan-gold text-[10px] font-black uppercase tracking-widest mb-4 border border-pan-gold/20">
                                    {dict.pages.infrastructure.technicalDetails}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-bold">{selectedQuai.name}</h3>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-10" dir={quais.title === 'الأرصفة والمحطات' ? 'rtl' : 'ltr'}>
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-5 rounded-2xl bg-pan-pale/50 border border-pan-navy/5 text-center md:text-inherit">
                                    <div className="text-[10px] font-black text-pan-gray-400 uppercase tracking-widest mb-1">{dict.pages.infrastructure.labels.length}</div>
                                    <div className="text-2xl font-black text-pan-navy">{selectedQuai.length}</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-pan-pale/50 border border-pan-navy/5 text-center md:text-inherit">
                                    <div className="text-[10px] font-black text-pan-gray-400 uppercase tracking-widest mb-1">{dict.pages.infrastructure.labels.draft}</div>
                                    <div className="text-2xl font-black text-pan-sky">{selectedQuai.draft}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {selectedQuai.technicalDetails?.map((detail: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 group/detail">
                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-pan-gold shrink-0 group-hover/detail:scale-125 transition-transform" />
                                        <p className="text-pan-gray-600 font-medium leading-relaxed">{detail}</p>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setSelectedQuaiIndex(null)}
                                className="mt-12 w-full py-5 rounded-2xl bg-pan-navy text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-pan-sky transition-all shadow-xl shadow-pan-navy/10"
                            >
                                {dict.content.alertBar.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
