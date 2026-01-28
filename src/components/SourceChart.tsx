"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SourceStat } from "@/app/actions";

interface SourceChartProps {
    data: SourceStat[];
}

const COLORS = ['#ccff00', '#99cc00', '#669900', '#336600', '#444', '#222'];

export function SourceChart({ data }: SourceChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="source-chart-card w-full h-[300px] bg-[#0a0a0a] border border-white/5 p-6 relative group overflow-hidden flex flex-col md:flex-row gap-6 rounded-3xl shadow-2xl">

            <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[#ccff00] font-mono uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ccff00] block animate-pulse" />
                        Radar de Origem
                    </h3>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#ccff00' }}
                            formatter={(value: any) => [value, "Leads"]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full md:w-48 flex flex-col justify-center gap-2 text-xs">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-white/5 pb-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-muted-foreground uppercase text-[10px] md:text-xs" title={entry.name}>
                                {entry.name.split('_')[0]}
                            </span>
                        </div>
                        <span className="font-bold text-white">{entry.value}</span>
                    </div>
                ))}
            </div>

        </div>
    );
}
