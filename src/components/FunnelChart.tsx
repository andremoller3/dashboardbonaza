"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { FunnelStat } from "@/app/actions";

interface FunnelChartProps {
    data: FunnelStat[];
}

export function FunnelChart({ data }: FunnelChartProps) {
    if (!data || data.length === 0) return null;

    return (

        <div className="funnel-chart-card w-full h-[300px] bg-[#0a0a0a] border border-white/5 p-6 relative group overflow-hidden flex flex-col rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#ccff00] font-mono uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#ccff00] block animate-pulse" />
                    Termômetro de Leads
                </h3>
            </div>

            {/* Graphic Chart (Visible on Screen, Hidden on PDF) */}
            <div className="chart-container flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 50, left: 40, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={80}
                            tick={{ fill: '#666', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#ccff00' }}
                        />
                        <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                            <LabelList dataKey="value" position="right" fill="#fff" fontSize={12} fontWeight="bold" />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Text Data List (Hidden on Screen, Visible on PDF) */}
            <div className="pdf-data-list hidden flex-col gap-2 mt-2">
                {data.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-black pb-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black/50" />
                            <span className="text-xs uppercase font-bold">{entry.name}</span>
                        </div>
                        <span className="font-bold text-sm">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
