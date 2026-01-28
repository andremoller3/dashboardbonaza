"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VehicleFilterProps {
    selected: string;
    onSelect: (vehicle: string) => void;
}

const VEHICLES = [
    { id: "triton", label: "MITSUBISHI TRITON" },
    { id: "fuso", label: "FUSO" },
    { id: "kaiyi", label: "KAIYI" },
];

export function VehicleFilter({ selected, onSelect }: VehicleFilterProps) {
    return (
        <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="text-base font-black uppercase tracking-widest text-[#ccff00] mr-2 font-mono drop-shadow-[0_0_5px_rgba(204,255,0,0.5)]">
                MODELOS :
            </span>
            {VEHICLES.map((vehicle) => {
                const isActive = selected === vehicle.id;
                return (
                    <button
                        key={vehicle.id}
                        onClick={() => onSelect(vehicle.id)}
                        className={cn(
                            "relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                            "border border-white/10 overflow-hidden group",
                            isActive
                                ? "text-[#ccff00] border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                                : "text-[#ccff00]/70 hover:text-[#ccff00] hover:border-[#ccff00]/50"
                        )}
                    >
                        {/* Active Background Slide (Subtle Glow) */}
                        {isActive && (
                            <motion.div
                                layoutId="active-vehicle-bg"
                                className="absolute inset-0 bg-[#ccff00]/10 -z-10"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Hover Glitch Effect (Subtle) */}
                        <span className="relative z-10 flex items-center gap-2">
                            {isActive && (
                                <span className="w-1.5 h-1.5 bg-black animate-pulse" />
                            )}
                            {vehicle.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
