"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatViewer } from "@/components/ChatViewer";
import { useState } from "react";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";

export default function ChatsPage() {
    // Reusing sidebar logic for consistency
    const [selectedVehicle, setSelectedVehicle] = useState("triton");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-foreground relative">
            <Sidebar
                selected={selectedVehicle}
                onSelect={setSelectedVehicle}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <main className="flex-1 ml-0 md:ml-64 min-h-screen p-4 md:p-8 w-full flex flex-col">
                <AnimatedWrapper>
                    <div className="max-w-7xl mx-auto w-full">
                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-6 text-white">
                            Histórico de <span className="text-[#00a884]">Conversas</span>
                        </h1>
                        <ChatViewer />
                    </div>
                </AnimatedWrapper>
            </main>
        </div>
    );
}
