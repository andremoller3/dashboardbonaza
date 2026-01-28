"use client";

import { AgentMetric } from "@/lib/mockData"; // Import type
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";

interface MetricsTableProps {
    data: AgentMetric[];
}

export function MetricsTable({ data }: MetricsTableProps) {
    return (
        <div className="w-full overflow-hidden border border-white/5 bg-[#0a0a0a] rounded-3xl shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[#ccff00] uppercase tracking-widest text-[10px] drop-shadow-[0_0_5px_rgba(204,255,0,0.3)]">
                            <th className="p-4 font-semibold">Data</th>
                            <th className="p-4 font-semibold text-right">Novos Leads</th>
                            <th className="p-4 font-semibold text-right">Form/Anúncio</th>
                            <th className="p-4 font-semibold text-right">Atendidos</th>
                            <th className="p-4 font-semibold text-right">Transferidos</th>
                            <th className="p-4 font-semibold text-right">Follow-ups</th>
                            <th className="p-4 font-semibold text-right">Não Engajados (&lt;2)</th>
                            <th className="p-4 font-semibold text-right">Engajados (&gt;2)</th>
                            <th className="p-4 font-semibold text-right">Taxa Engaj.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {data.map((row, index) => (
                                <motion.tr
                                    key={row.dateIso} // Use unique ISO date as key
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group border-b border-border/50 transition-colors hover:bg-white/5"
                                >
                                    <td className="p-4 font-medium text-foreground">
                                        {format(parseISO(row.dateIso), "dd/MM/yyyy")}
                                    </td>
                                    <td className="p-4 text-right font-medium text-foreground">{row.leads}</td>
                                    <td className="p-4 text-right">{row.formAds}</td>
                                    <td className="p-4 text-right">{row.attended}</td>
                                    <td className="p-4 text-right text-muted-foreground">{row.transferred}</td>
                                    <td className="p-4 text-right">{row.followUps}</td>
                                    <td className="p-4 text-right text-muted-foreground">{row.noContinuity}</td>
                                    <td className="p-4 text-right font-medium text-primary">{row.withContinuity}</td>
                                    <td className="p-4 text-right">
                                        <span
                                            className={cn(
                                                "px-2 py-1 text-xs font-bold",
                                                row.continuityRate !== "0,0%"
                                                    ? "bg-primary/20 text-primary"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {row.continuityRate}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>

                        {data.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-muted-foreground uppercase tracking-widest">
                                    Nenhum dado encontrado para o período selecionado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
