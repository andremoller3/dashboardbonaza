"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { handleSignOut } from "@/app/lib/actions";

interface SidebarProps {
    selected: string;
    onSelect: (model: string) => void;
}

const MODELS = [
    { id: "triton", label: "TRITON" },
    { id: "fuso", label: "FUSO" },
    { id: "kaiyi", label: "KAIYI" },
];

export function Sidebar({ selected, onSelect }: SidebarProps) {
    return (
        <aside className="w-72 h-screen fixed left-0 top-0 bg-black flex flex-col z-50 pl-4 py-4">

            {/* Inner Floating Container */}
            <div className="flex-1 bg-[#0a0a0a] rounded-3xl border border-white/5 flex flex-col relative overflow-hidden shadow-2xl">

                {/* Logo Area */}
                <div className="p-8 pb-8 flex justify-center">
                    <div className="relative w-28 h-28 opacity-90 hover:opacity-100 transition-opacity">
                        <Image
                            src="/logo.png"
                            alt="BD Bonanza"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-3">
                    <div className="text-[#ccff00] text-xs font-mono font-black uppercase tracking-[0.2em] mb-6 text-center drop-shadow-[0_0_8px_rgba(204,255,0,0.6)] opacity-100">
                        SELECIONE O MODELO
                    </div>

                    <div className="flex flex-col gap-2">
                        {MODELS.map((model) => {
                            const isActive = selected === model.id;
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => onSelect(model.id)}
                                    className={cn(
                                        "relative w-full text-left py-4 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-2xl group",
                                        isActive
                                            ? "text-[#ccff00] bg-[#ccff00]/10 shadow-[0_0_30px_-5px_rgba(204,255,0,0.15)] translate-x-2"
                                            : "text-[#666] hover:text-white hover:bg-white/5 hover:translate-x-1"
                                    )}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <span>{model.label}</span>

                                        {/* Active Dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-dot"
                                                className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            />
                                        )}
                                    </div>

                                    {/* Active Background Border (Optional subtle stroke) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-border"
                                            className="absolute inset-0 rounded-2xl border border-[#ccff00]/20 pointer-events-none"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer / Status */}
                <div className="p-6 text-[9px] text-[#333] font-mono uppercase text-center tracking-widest">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#ccff00] animate-pulse mr-2" />
                    System Online
                </div>

                {/* Logout Section */}
                <div className="mt-auto pt-8 border-t border-white/10">
                    <form action={handleSignOut}>
                        <button className="flex items-center gap-3 text-muted-foreground hover:text-red-500 transition-colors w-full px-4 py-2 group">
                            <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-black/50 group-hover:border-red-500/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            </div>
                            <span className="font-medium tracking-wide uppercase text-xs">Sair</span>
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
