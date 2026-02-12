"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

// --- Mock Data simulating the CSV structure ---
const RAW_CSV_DATA = [
    { id: 116078, session_id: "6a2a-4fd3", type: "ai", content: "Hola Hipolito, gracias por tu interés en la nueva Mitsubishi Triton. ¿La buscas para trabajo pesado o para uso familiar? 🚙" },
    { id: 116077, session_id: "6a2a-4fd3", type: "human", content: "Mensaje del lead: Me gustaría obtener más información\nNombre del lead: Hipolito \nOrigen del lead: facebook_messenger" },
    { id: 116076, session_id: "533a-489b", type: "ai", content: "¡Saludos! Soy Carmen de Bonanza Mitsubishi. Estamos muy emocionados con la nueva Triton. ¿Para qué uso la busca: trabajo pesado o uso familiar?" },
    { id: 116075, session_id: "533a-489b", type: "human", content: "Mensaje del lead: Me gustaría obtener más información\nNombre del lead: Aridia \nOrigen del lead: facebook_messenger" },
    { id: 116067, session_id: "8f9e-4ac6", type: "human", content: "Mensaje del lead: [Imagem enviada]\nNombre del lead: Cristian Ramirez \nOrigen del lead: facebook_messenger" },
    { id: 116068, session_id: "8f9e-4ac6", type: "ai", content: "Entiendo, Cristian. ¿Podría decirme si está interesado en la Triton para trabajo pesado o para uso familiar?" }
];

interface ChatMessage {
    id: number;
    sender: "human" | "ai";
    content: string;
    timestamp: string; // Simulated
}

interface ChatSession {
    id: string;
    leadName: string;
    leadSource: string;
    lastMessage: string;
    messages: ChatMessage[];
    avatarColor: string;
}

export function ChatViewer() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    // Process raw data into structured sessions
    const sessions = useMemo(() => {
        const sessionMap: Record<string, ChatSession> = {};

        // Process in reverse to get chronological order if needed, or sort later
        // Treating raw data as descending ID (newest first)
        const sortedRaw = [...RAW_CSV_DATA].sort((a, b) => a.id - b.id);

        sortedRaw.forEach((row) => {
            if (!sessionMap[row.session_id]) {
                sessionMap[row.session_id] = {
                    id: row.session_id,
                    leadName: "Lead Desconhecido", // Will extract from human message
                    leadSource: "unknown",
                    lastMessage: "",
                    messages: [],
                    avatarColor: getRandomColor(row.session_id)
                };
            }

            const session = sessionMap[row.session_id];

            // Extract metadata from human message if available
            if (row.type === "human") {
                const nameMatch = row.content.match(/Nombre del lead: (.*?)(\n|$)/);
                if (nameMatch) session.leadName = nameMatch[1].trim();

                const sourceMatch = row.content.match(/Origen del lead: (.*?)(\n|$)/);
                if (sourceMatch) session.leadSource = sourceMatch[1].trim();
            }

            // Clean content for display (remove metadata from human msg)
            let cleanContent = row.content;
            if (row.type === "human" && row.content.startsWith("Mensaje del lead:")) {
                const msgMatch = row.content.match(/Mensaje del lead: (.*?)(\n|$)/);
                cleanContent = msgMatch ? msgMatch[1] : "Mensagem enviada";
            }

            session.messages.push({
                id: row.id,
                sender: row.type as "human" | "ai",
                content: cleanContent,
                timestamp: "10:30" // Placeholder
            });

            session.lastMessage = cleanContent;
        });

        return Object.values(sessionMap);
    }, []);

    const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

    useEffect(() => {
        if (!selectedSessionId && sessions.length > 0) {
            setSelectedSessionId(sessions[0].id);
        }
    }, [sessions, selectedSessionId]);

    return (
        <div className="flex bg-[#111b21] rounded-3xl overflow-hidden h-[600px] border border-white/10 shadow-2xl">
            {/* Sidebar (Session List) */}
            <div className="w-1/3 border-r border-white/10 bg-[#111b21] flex flex-col">
                <div className="p-4 bg-[#202c33] flex items-center justify-between">
                    <h2 className="text-[#e9edef] font-bold text-lg">Conversas</h2>
                    <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full border border-[#aebac1]"></div>
                        <div className="w-5 h-5 rounded-full border border-[#aebac1]"></div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-2 bg-[#111b21]">
                    <div className="bg-[#202c33] rounded-lg p-2 flex items-center">
                        <svg className="w-5 h-5 text-[#aebac1] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input type="text" placeholder="Pesquisar ou começar uma nova..." className="bg-transparent text-[#d1d7db] text-sm md:text-md w-full focus:outline-none placeholder-[#8696a0]" />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedSessionId(session.id)}
                            className={`flex items-center p-3 cursor-pointer hover:bg-[#202c33] transition-colors ${selectedSessionId === session.id ? 'bg-[#2a3942]' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 shrink-0`} style={{ backgroundColor: session.avatarColor }}>
                                {session.leadName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 border-b border-white/5 pb-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-[#e9edef] font-normal truncate max-w-[140px]">{session.leadName}</h3>
                                    <span className="text-[#8696a0] text-xs">Ontem</span>
                                </div>
                                <p className="text-[#8696a0] text-sm truncate">{session.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeSession ? (
                <div className="flex-1 flex flex-col bg-[#0b141a] relative">
                    {/* Header */}
                    <div className="bg-[#202c33] px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3`} style={{ backgroundColor: activeSession.avatarColor }}>
                                {activeSession.leadName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-[#e9edef] font-normal">{activeSession.leadName}</h3>
                                <p className="text-[#8696a0] text-xs">
                                    via {activeSession.leadSource} • Última interação hoje
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 text-[#aebac1]">
                            <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-fixed opacity-90">
                        {/* Day Divider Example */}
                        <div className="flex justify-center mb-4">
                            <span className="bg-[#1f2c34] text-[#8696a0] text-xs px-3 py-1.5 rounded-lg shadow-sm">
                                HOJE
                            </span>
                        </div>

                        {activeSession.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[65%] rounded-lg p-2 px-3 shadow-sm relative ${msg.sender === 'ai' ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'}`}>
                                    {/* Tail SVG could go here */}

                                    <div className="text-sm md:text-md leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                    <div className="flex justify-end items-center gap-1 mt-1">
                                        <span className="text-[10px] text-[#8696a0]">{msg.timestamp}</span>
                                        {msg.sender === 'ai' && (
                                            <span className="text-[#53bdeb]">
                                                {/* Double Check Icon */}
                                                <svg viewBox="0 0 16 15" width="16" height="15" className=""><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-7.655a.425.425 0 0 0-.063-.51zM6.658 8.441a.323.323 0 0 1-.456.035L1.705 4.39a.379.379 0 0 0-.514.062l-.46.386a.426.426 0 0 0 .064.63l4.7 4.195a.322.322 0 0 0 .44-.02l.628-.582a.316.316 0 0 1 .446-.03l.365.336a.32.32 0 0 1 .03.45l-1.352 1.55a.426.426 0 0 1-.62.036L.265 6.004a.972.972 0 0 1 .135-1.42l1.049-.877a.922.922 0 0 1 1.272.155l3.297 3.472a.323.323 0 0 0 .463-.036l.206-.247a.317.317 0 0 1 .48-.027l.45.426a.328.328 0 0 0 .01.46z"></path></svg>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Input (Read Only for now) */}
                    <div className="bg-[#202c33] p-3 flex items-center gap-4">
                        <div className="flex-1 bg-[#2a3942] rounded-lg p-2.5 text-[#8696a0] text-sm italic">
                            Modo visualização (histórico)
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-[#222e35] flex flex-col items-center justify-center border-b-[6px] border-[#00a884]">
                    <h2 className="text-[#e9edef] text-3xl font-light mb-4">Dashboard Carmen Web</h2>
                    <p className="text-[#8696a0] text-sm">Selecione uma conversa para ver o histórico.</p>
                </div>
            )}
        </div>
    );
}

// Utility for formatting
function getRandomColor(seed: string) {
    const colors = ["#00a884", "#34b7f1", "#657786", "#128c7e", "#075e54"];
    return colors[seed.charCodeAt(0) % colors.length];
}
