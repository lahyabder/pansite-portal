'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Hotspot {
    id: string;
    name: string;
    top: string;
    left: string;
    status: 'active' | 'available' | 'maintenance';
    details: {
        length: string;
        draft: string;
        info: string;
    };
}

const hotspots: Hotspot[] = [
    {
        id: 'commerce',
        name: 'Quai de Commerce',
        top: '30%',
        left: '25%',
        status: 'active',
        details: {
            length: '350m',
            draft: '9.0m',
            info: 'Principal quai pour le fret et conteneurs'
        }
    },
    {
        id: 'pesche',
        name: 'Quai de Pêche',
        top: '60%',
        left: '70%',
        status: 'active',
        details: {
            length: '280m',
            draft: '7.0m',
            info: 'Zone dédiée à la pêche industrielle'
        }
    },
    {
        id: 'petrolier',
        name: 'Terminal Pétrolier',
        top: '20%',
        left: '60%',
        status: 'available',
        details: {
            length: '200m',
            draft: '12.0m',
            info: 'Déchargement sécurisé d\'hydrocarbures'
        }
    }
];

export const InfrastructureMap = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group bg-pan-navy/20">
            {/* Base Image */}
            <Image
                src="/images/infrastructure-map.png"
                alt="Port Map"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-pan-navy/20 mix-blend-multiply" />

            {/* Hotspots */}
            {hotspots.map((spot) => (
                <div
                    key={spot.id}
                    className="absolute z-20 cursor-pointer"
                    style={{ top: spot.top, left: spot.left }}
                    onMouseEnter={() => setHoveredId(spot.id)}
                    onMouseLeave={() => setHoveredId(null)}
                >
                    {/* Pulsing Dot */}
                    <div className={`relative flex items-center justify-center`}>
                        <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${spot.status === 'active' ? 'bg-pan-sky' : 'bg-pan-gold'}`} />
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${spot.status === 'active' ? 'bg-pan-sky' : 'bg-pan-gold'}`} />
                    </div>

                    {/* Tooltip (Glassmorphism) */}
                    {hoveredId === spot.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h4 className="text-white font-bold mb-1">{spot.name}</h4>
                            <p className="text-white/60 text-xs mb-3">{spot.details.info}</p>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Long.</span>
                                    <div className="text-white text-sm font-bold">{spot.details.length}</div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Prof.</span>
                                    <div className="text-pan-gold text-sm font-bold">{spot.details.draft}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 text-white z-30">
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Légende</div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pan-sky" />
                        <span className="text-xs">Quai opérationnel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pan-gold" />
                        <span className="text-xs">Maintenance / Disponible</span>
                    </div>
                </div>
            </div>
            
            {/* Zoom Hint */}
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-30">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors">+</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors">-</button>
            </div>
        </div>
    );
};
