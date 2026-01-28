"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateRange = {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
};

interface DateFilterProps {
    onFilterChange: (range: DateRange) => void;
    className?: string;
}

export function DateFilter({ onFilterChange, className }: DateFilterProps) {
    const [activePreset, setActivePreset] = useState<"today" | "yesterday" | "custom">("today");
    const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const handlePreset = (preset: "today" | "yesterday") => {
        setActivePreset(preset);
        const today = new Date();
        let start = "";
        let end = "";

        if (preset === "today") {
            start = format(today, "yyyy-MM-dd");
            end = format(today, "yyyy-MM-dd");
        } else {
            const yesterday = subDays(today, 1);
            start = format(yesterday, "yyyy-MM-dd");
            end = format(yesterday, "yyyy-MM-dd");
        }

        setStartDate(start);
        setEndDate(end);
        onFilterChange({ start, end });
    };

    const handleCustomRange = () => {
        setActivePreset("custom");
        onFilterChange({ start: startDate, end: endDate });
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-4 p-4 border border-white/5 bg-[#0a0a0a] rounded-3xl shadow-lg", className)}>
            <div className="flex items-center gap-2 text-[#ccff00] uppercase tracking-widest text-xs font-bold drop-shadow-[0_0_5px_rgba(204,255,0,0.4)]">
                <Filter className="h-4 w-4 text-[#ccff00]" />
                Filtro
            </div>

            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

            {/* Presets */}
            <div className="flex gap-2">
                <button
                    onClick={() => handlePreset("today")}
                    className={cn(
                        "px-4 py-2 text-sm font-bold uppercase transition-all rounded-xl border",
                        activePreset === "today"
                            ? "bg-[#ccff00]/20 text-[#ccff00] border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.1)]"
                            : "bg-white/5 text-muted-foreground border-transparent hover:text-white hover:bg-white/10"
                    )}
                >
                    Hoje
                </button>
                <button
                    onClick={() => handlePreset("yesterday")}
                    className={cn(
                        "px-4 py-2 text-sm font-bold uppercase transition-all rounded-xl border",
                        activePreset === "yesterday"
                            ? "bg-[#ccff00]/20 text-[#ccff00] border-[#ccff00]/30 shadow-[0_0_10px_rgba(204,255,0,0.1)]"
                            : "bg-white/5 text-muted-foreground border-transparent hover:text-white hover:bg-white/10"
                    )}
                >
                    Ontem
                </button>
            </div>

            {/* Manual Range */}
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value);
                        setActivePreset("custom");
                        // Auto-apply if both present, or wait? Let's auto-apply for seamless feel
                        if (endDate) onFilterChange({ start: e.target.value, end: endDate });
                    }}
                    className="bg-transparent text-white text-xs p-1 focus:outline-none focus:text-[#ccff00] uppercase font-mono cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(89%)_sepia(23%)_saturate(6778%)_hue-rotate(24deg)_brightness(108%)_contrast(106%)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <span className="text-muted-foreground">-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                        setEndDate(e.target.value);
                        setActivePreset("custom");
                        if (startDate) onFilterChange({ start: startDate, end: e.target.value });
                    }}
                    className="bg-transparent text-white text-xs p-1 focus:outline-none focus:text-[#ccff00] uppercase font-mono cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-[invert(89%)_sepia(23%)_saturate(6778%)_hue-rotate(24deg)_brightness(108%)_contrast(106%)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
            </div>
        </div>
    );
}
