"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { MetricsTable } from "@/components/MetricsTable";
import { DateFilter, DateRange } from "@/components/DateFilter";
import { FunnelChart } from "@/components/FunnelChart";
import { SourceChart } from "@/components/SourceChart";
import { Sidebar } from "@/components/Sidebar";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { getMetrics, FunnelStat, SourceStat } from "@/app/actions";
import { AgentMetric } from "@/lib/mockData";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  // Default to Today
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [selectedVehicle, setSelectedVehicle] = useState("triton");

  const [metrics, setMetrics] = useState<AgentMetric[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelStat[]>([]);
  const [sourceData, setSourceData] = useState<SourceStat[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getMetrics(dateRange.start, dateRange.end, selectedVehicle);
      setMetrics(data.dailyMetrics);
      setFunnelData(data.funnelStats);
      setSourceData(data.sourceStats);
    }
    fetchData();
  }, [dateRange, selectedVehicle]);

  const displayDate = useMemo(() => {
    if (dateRange.start === dateRange.end) {
      return format(parseISO(dateRange.start), "dd 'de' MMMM, yyyy", { locale: ptBR });
    }
    return `${format(parseISO(dateRange.start), "dd/MM")} - ${format(parseISO(dateRange.end), "dd/MM/yyyy")}`;
  }, [dateRange]);

  // Calculate totals for summary cards
  const summary = useMemo(() => {
    return metrics.reduce((acc, curr) => ({
      leads: acc.leads + curr.leads,
      attended: acc.attended + curr.attended,
      transferred: acc.transferred + (curr.transferred || 0),
      engaged: acc.engaged + (curr.withContinuity || 0),
      interactions: acc.interactions + (curr.withContinuity || 0) + (curr.noContinuity || 0)
    }), { leads: 0, attended: 0, transferred: 0, engaged: 0, interactions: 0 });
  }, [metrics]);

  const engagementRate = summary.interactions > 0
    ? ((summary.engaged / summary.interactions) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Fixed Sidebar */}
      <Sidebar selected={selectedVehicle} onSelect={setSelectedVehicle} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen p-8 md:p-12 lg:p-16">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Header Section (Title Only) */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
            <AnimatedWrapper direction="left">
              <h1 className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-1 md:mb-2">
                DASHBOARD <span className="text-[#ccff00]">BONANZA</span>
              </h1>
              <p className="mt-1 md:mt-2 text-muted-foreground text-sm md:text-lg">
                Acompanhamento em tempo real da performance do <strong>Agente IA</strong>.
              </p>
              <div className="mt-2 md:mt-4 inline-block border border-[#ccff00]/30 bg-[#ccff00]/5 px-3 py-1 md:px-4 rounded-sm">
                <span className="text-[#ccff00] font-mono text-xs md:text-sm uppercase tracking-widest mr-2">MODELO:</span>
                <span className="text-white font-black text-lg md:text-xl uppercase tracking-wider shadow-[#ccff00] drop-shadow-[0_0_5px_rgba(204,255,0,0.5)]">
                  {selectedVehicle}
                </span>
              </div>
            </AnimatedWrapper>

            <AnimatedWrapper direction="right" delay={0.2} className="flex flex-col gap-4 items-end">
              {/* Filter Component */}
              <div className="no-print">
                <DateFilter onFilterChange={setDateRange} />
              </div>

              <div className="no-print">
                <ExportPdfButton targetId="dashboard-report" />
              </div>
            </AnimatedWrapper>
          </header>

          {/* Dashboard Content - Targeted for PDF Capture */}
          <section id="dashboard-report" className="print-container space-y-8 bg-background p-4 md:p-0">

            {/* PDF ONLY HEADER (Hidden on Screen) */}
            <div className="pdf-header hidden mb-8 border-b border-white/20 pb-6">
              <div className="flex items-center justify-between">
                <div className="relative w-32 h-32">
                  {/* We use specific dimensions for PDF reliability */}
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                  />
                </div>
                <div className="text-right">
                  <h1 className="text-4xl font-black uppercase text-white tracking-widest">Dashboard</h1>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest mt-1">performance report</p>
                  <div className="mt-4 border border-[#ccff00] bg-[#ccff00]/10 px-4 py-1 inline-block">
                    <span className="text-[#ccff00] font-bold text-xl uppercase">{selectedVehicle}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Context Header */}
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Período:</div>
              <div className="text-xl font-bold text-primary">{displayDate}</div>
            </div>

            <AnimatedWrapper delay={0.4}>
              <MetricsTable data={metrics} />
            </AnimatedWrapper>

            {/* Footer Summary (Dynamic based on filter) */}
            <AnimatedWrapper delay={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="border border-white/5 p-6 bg-[#0a0a0a] rounded-3xl shadow-lg hover:border-[#ccff00]/20 transition-colors group">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-[#ccff00] transition-colors">Novos Leads</div>
                  <div className="text-4xl font-black tracking-tight">{summary.leads}</div>
                </div>
                <div className="border border-white/5 p-6 bg-[#0a0a0a] rounded-3xl shadow-lg hover:border-[#ccff00]/20 transition-colors group">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-[#ccff00] transition-colors">Taxa de Engajamento</div>
                  <div className="text-4xl font-black tracking-tight text-[#ccff00] drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">{engagementRate}%</div>
                </div>
                <div className="border border-white/5 p-6 bg-[#0a0a0a] rounded-3xl shadow-lg hover:border-[#ccff00]/20 transition-colors group">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-[#ccff00] transition-colors">Transferidos</div>
                  <div className="text-4xl font-black tracking-tight text-[#ccff00] drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">{summary.transferred}</div>
                </div>
                <div className="border border-white/5 p-6 bg-[#0a0a0a] rounded-3xl shadow-lg hover:border-[#ccff00]/20 transition-colors group">
                  <div className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-[#ccff00] transition-colors">Atendidos</div>
                  <div className="text-4xl font-black tracking-tight">{summary.attended}</div>
                </div>
              </div>
            </AnimatedWrapper>

            {/* Visual Analytics Modules */}
            <AnimatedWrapper delay={0.8}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FunnelChart data={funnelData} />
                <SourceChart data={sourceData} />
              </div>
            </AnimatedWrapper>

          </section>

        </div>
      </main>
    </div>
  );
}
