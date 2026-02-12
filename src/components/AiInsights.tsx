import { useMemo } from "react";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";

// Mock Data for Prototype
const MOCK_SENTIMENT = {
    positive: 65,
    neutral: 25,
    negative: 10,
    dailyScore: 8.5 // 0 to 10
};

const MOCK_RECAP = [
    "📈 O volume de leads aumentou 20% no período da tarde.",
    "⚠️ 3 clientes reclamaram da demora na resposta sobre 'Financiamento'.",
    "✅ A oferta da Triton Sport teve alta conversão hoje."
];

const MOCK_HOT_LEADS = [
    { name: "Roberto Silva", score: 98, interest: "Triton Sport", status: "Quente" },
    { name: "Ana Souza", score: 85, interest: "Eclipse Cross", status: "Morno" },
    { name: "Carlos Oliveira", score: 92, interest: "L200 Outdoor", status: "Quente" },
];

export function AiInsights() {
    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 1. Sentiment Analysis Card */}
            <div className="col-span-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#ccff00]/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5 10 10 0 0 0-4.06 6" /><path d="M2.1 6.1a10 10 0 0 1 10.6-2.8" /><path d="M16 11a5 5 0 0 0-2.8 9.3" /><path d="M12.8 19.3a10 10 0 0 1-8-8.6" /></svg>
                </div>

                <h3 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
                    Análise de Sentimento
                </h3>

                <div className="flex items-center justify-between mb-6">
                    <div className="text-5xl font-black text-white">{MOCK_SENTIMENT.dailyScore}<span className="text-xl text-muted-foreground">/10</span></div>
                    <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">Humor Geral</div>
                        <div className="text-[#ccff00] font-bold">MUITO BOM</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>Positivo</span>
                            <span>{MOCK_SENTIMENT.positive}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${MOCK_SENTIMENT.positive}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>Neutro</span>
                            <span>{MOCK_SENTIMENT.neutral}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${MOCK_SENTIMENT.neutral}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>Negativo</span>
                            <span>{MOCK_SENTIMENT.negative}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${MOCK_SENTIMENT.negative}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Smart Recap Card */}
            <div className="col-span-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#ccff00]/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>

                <h3 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
                    Resumo Inteligente
                </h3>

                <div className="space-y-4">
                    {MOCK_RECAP.map((item, index) => (
                        <div key={index} className="bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-gray-300">
                            {item}
                        </div>
                    ))}
                    <div className="pt-2">
                        <button className="text-xs text-[#ccff00] uppercase font-bold tracking-wider hover:underline flex items-center gap-1">
                            Ver resumo completo
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Hot Leads Card */}
            <div className="col-span-1 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-[#ccff00]/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>

                <h3 className="text-[#ccff00] font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
                    Leads Quentes 🔥
                </h3>

                <div className="space-y-2">
                    {MOCK_HOT_LEADS.map((lead, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-[#ccff00] text-black' : 'bg-white/20 text-white'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{lead.name}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">{lead.interest}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-black text-[#ccff00]">{lead.score}</div>
                                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Score</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
