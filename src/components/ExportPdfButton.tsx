"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportPdfButtonProps {
    targetId: string;
    filename?: string;
    className?: string;
}

export function ExportPdfButton({
    targetId,
    filename = "dashboard-metrics.pdf",
    className,
}: ExportPdfButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setIsExporting(true);

        try {
            // 1. Create a container for our clone to live in
            const cloneContainer = document.createElement("div");
            cloneContainer.style.position = "absolute";
            cloneContainer.style.top = "-9999px";
            cloneContainer.style.left = "-9999px";
            // Slightly narrower width = "Zoomed In" look on PDF
            // 1100px fits the table columns well without squishing, but makes everything larger than 1280px
            cloneContainer.style.width = "1100px";
            document.body.appendChild(cloneContainer);

            // 2. Clone the element
            const node = element.cloneNode(true) as HTMLElement;
            cloneContainer.appendChild(node);

            // 3. Reveal Headers in Clone and Hide No-Print
            const headers = node.querySelectorAll(".pdf-header");
            headers.forEach((header) => {
                (header as HTMLElement).style.display = "block";
                (header as HTMLElement).style.visibility = "visible";
            });

            const noPrints = node.querySelectorAll(".no-print");
            noPrints.forEach((el) => {
                (el as HTMLElement).style.display = "none";
            });

            // 4. Force B&W / Clean Print Styles
            const style = document.createElement("style");
            style.innerHTML = `
        * {
          text-shadow: none !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* Force White Backgrounds */
        .bg-background, .bg-card, .bg-black, body, div, table, tr, td {
             background-color: #ffffff !important;
             color: #000000 !important;
             border-radius: 0px !important; /* STRICT: No rounded corners in PDF */
             box-shadow: none !important; /* STRICT: No glows/shadows in PDF */
        }
        
        /* TABLE OPTIMIZATIONS */
        /* Prevent Scroll */
        .overflow-auto, .overflow-x-auto {
            overflow: visible !important;
        }
        /* Ensure Table Fits: Slightly reduced font, but bigger relative to page due to 1100px width */
        table, th, td {
            font-size: 10px !important;
        }
        th, td {
            padding: 8px 4px !important;
            white-space: nowrap !important;
        }
        
        /* Remove Gray from Table Headers and add Border */
        thead tr, th {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-bottom: 2px solid #000000 !important;
        }
        
        /* Force Black Text */
        span, p, h1, h2, h3, div, text, th, td {
            color: #000000 !important;
            fill: #000000 !important;
        }
        /* Fix Charts */
        path { stroke: #000000 !important; }
        .recharts-sector { stroke: #000000 !important; stroke-width: 1px; }
        
        /* Borders */
        .border-border, .border-white\\/10 {
            border-color: #e5e5e5 !important;
        }

        /* FIX for Source Chart & Funnel Chart - TEXT ONLY MODE */
        
        /* 1. Reset Card Layouts */
        .source-chart-card, .funnel-chart-card {
             flex-direction: column !important;
             height: auto !important;
             min-height: 0 !important;
             border: 1px solid #000 !important;
             padding: 15px !important;
        }

        /* 2. HIDE GRAPHICS (The Chart SVGs) */
        .recharts-responsive-container, 
        .source-chart-card > div:first-child .recharts-wrapper,
        .funnel-chart-card .chart-container {
             display: none !important;
        }

        /* 3. REVEAL TEXT LISTS (Funnel) */
        .pdf-data-list {
             display: flex !important;
        }

        /* 4. Formatting for Source Chart Legend (Make it look like a list) */
        .source-chart-card > div:last-child {
             width: 100% !important;
             margin-top: 0 !important;
        }
        
        /* General Text List Styling for PDF */
        .text-xs, .text-sm, .font-bold {
             color: #000000 !important; 
        }
        
        /* List Item Spacing */
        .source-chart-card > div:last-child > div,
        .pdf-data-list > div {
             border-bottom: 1px solid #ddd !important;
             padding-bottom: 4px !important;
             margin-bottom: 4px !important;
        }

      `;
            node.appendChild(style);

            // 5. Generate Image
            const dataUrl = await toPng(node, {
                quality: 1.0,
                pixelRatio: 2, // High resolution
                backgroundColor: '#ffffff',
                width: 1100, // Match container
            });

            // 6. Generate PDF
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const img = new Image();
            img.src = dataUrl;
            await new Promise((resolve) => { img.onload = resolve; });

            const imgWidth = img.width;
            const imgHeight = img.height;

            // Smaller margins (5mm) to allow max size
            const margin = 5;
            const availableWidth = pdfWidth - (margin * 2);
            const availableHeight = pdfHeight - (margin * 2);

            const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

            // Center image
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = margin;

            pdf.addImage(dataUrl, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(filename);

            // 7. Cleanup
            document.body.removeChild(cloneContainer);

        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
                "group flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50",
                "border border-transparent hover:border-white/20",
                className
            )}
        >
            {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            )}
            {isExporting ? "Gerando..." : "Exportar PDF"}
        </button>
    );
}
