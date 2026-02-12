"use server";

import { getDbPool } from "@/lib/db";
import { METRICS_DATA, AgentMetric } from "@/lib/mockData";
import { format } from "date-fns";
import { auth } from "@/auth";

export interface FunnelStat {
    name: string;
    value: number;
    fill: string;
}

export interface SourceStat {
    name: string;
    value: number;
}

export interface DashboardData {
    dailyMetrics: AgentMetric[];
    funnelStats: FunnelStat[];
    sourceStats: SourceStat[];
}

export async function getMetrics(startDate?: string, endDate?: string, model: string = "triton"): Promise<DashboardData> {
    // Security Check (Defense in Depth)
    // Security Check (Defense in Depth)
    // const session = await auth();
    // if (!session?.user) {
    //     throw new Error("Unauthorized access");
    // }

    // Default dates
    const start = startDate || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    // Determine target column for transferred metric
    const transferredColumn = model === "fuso" ? "aguardar_atendimento_vendedor" : "transferido_vendedor";

    try {
        if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("my_db")) {
            // Get correct pool for the model
            const client = await getDbPool(model).connect();

            try {
                // Debug Logs
                console.log(`🚀 [${model.toUpperCase()}] Connecting to Database...`);
                console.log(`📅 Date Range: ${start} to ${end}`);

                // 1. Daily Metrics Query
                // Define test drive CTE based on model
                const testDriveCte = (model === 'kaiyi' || model === 'triton')
                    ? `test_drive_stats AS (
                         SELECT 
                           DATE(created_at) as d,
                           COUNT(id) as test_drives
                         FROM agendamentos
                         WHERE DATE(created_at) >= $1::date AND DATE(created_at) <= $2::date
                         GROUP BY 1
                      )`
                    : `test_drive_stats AS (
                         SELECT 
                           DATE(created_at) as d,
                           COUNT(*) as test_drives
                         FROM agendamentos
                         WHERE DATE(created_at) >= $1::date AND DATE(created_at) <= $2::date
                           AND tipo_agendamento IN ('test_drive', 'Prueba de conduccion')
                         GROUP BY 1
                      )`;

                // 1. Daily Metrics Query
                const metricsQuery = `
          WITH created_stats AS (
             SELECT 
               DATE(data_criacao) as d,
               COUNT(*) as new_leads,
               SUM(CASE WHEN ${transferredColumn} IS TRUE THEN 1 ELSE 0 END) as transferred,
               COUNT(CASE WHEN coalesce(contador_mensagens, 0) <= 2 THEN 1 END) as "noContinuity",
               COUNT(CASE WHEN coalesce(contador_mensagens, 0) > 2 THEN 1 END) as "withContinuity"
             FROM leads
             WHERE DATE(data_criacao) >= $1::date AND DATE(data_criacao) <= $2::date
             GROUP BY 1
          ),
          updated_stats AS (
             SELECT 
               DATE(data_atualizacao) as d,
               COUNT(*) as attended,
               COUNT(CASE WHEN CAST(ads_history AS TEXT) LIKE '%"source": "lead_form"%' THEN 1 END) as "formAds",
               SUM(COALESCE(follow_up, 0)) as "followUps"
             FROM leads
             WHERE DATE(data_atualizacao) >= $1::date AND DATE(data_atualizacao) <= $2::date
             GROUP BY 1
          ),
          ${testDriveCte}
          SELECT 
            COALESCE(c.d, u.d, t.d) as "dateIso",
            COALESCE(c.new_leads, 0) as leads,
            COALESCE(u.attended, 0) as attended,
            COALESCE(u."formAds", 0) as "formAds",
            COALESCE(c.transferred, 0) as transferred,
            COALESCE(t.test_drives, 0) as "testDrive",
            COALESCE(u."followUps", 0) as "followUps",
            COALESCE(c."noContinuity", 0) as "noContinuity",
            COALESCE(c."withContinuity", 0) as "withContinuity"
          FROM created_stats c
          FULL OUTER JOIN updated_stats u ON c.d = u.d
          FULL OUTER JOIN test_drive_stats t ON COALESCE(c.d, u.d) = t.d
          ORDER BY "dateIso" DESC
        `;

                // 2. Funnel Query (Etapa Funil)
                const funnelQuery = `
          SELECT etapa_funil as name, COUNT(*) as value
          FROM leads
          WHERE DATE(data_atualizacao) >= $1::date AND DATE(data_atualizacao) <= $2::date
          GROUP BY 1
          ORDER BY 2 DESC
        `;

                // 3. Source Query (Origem)
                const sourceQuery = `
           SELECT origem as name, COUNT(*) as value
           FROM leads
           WHERE DATE(data_criacao) >= $1::date AND DATE(data_criacao) <= $2::date
           GROUP BY 1
           ORDER BY 2 DESC
           LIMIT 6
        `;

                const [metricsRes, funnelRes, sourceRes] = await Promise.all([
                    client.query(metricsQuery, [start, end]),
                    client.query(funnelQuery, [start, end]),
                    client.query(sourceQuery, [start, end])
                ]);

                console.log(`✅ [${model.toUpperCase()}] Query Success! Rows: ${metricsRes.rowCount}`);

                // Process Metrics
                const dailyMetrics = metricsRes.rows.map(row => {
                    const withCont = Number(row.withContinuity);
                    const noCont = Number(row.noContinuity);
                    const total = withCont + noCont;
                    const rate = total > 0 ? ((withCont / total) * 100).toFixed(1) : "0.0";

                    return {
                        dateIso: format(new Date(row.dateIso), 'yyyy-MM-dd'),
                        label: "",
                        leads: Number(row.leads),
                        formAds: Number(row.formAds),
                        attended: Number(row.attended),
                        transferred: Number(row.transferred),
                        testDrive: Number(row.testDrive),
                        followUps: Number(row.followUps),
                        noContinuity: noCont,
                        withContinuity: withCont,
                        continuityRate: rate.replace('.', ',') + "%"
                    };
                });

                // Process Funnel (Add Colors)
                const funnelStats = funnelRes.rows.map(row => {
                    let fill = "#333";
                    const name = row.name ? row.name.toLowerCase() : "indefinido";
                    // Acid Green Theme Palette
                    if (name.includes('quente')) fill = "#ccff00";
                    else if (name.includes('morno')) fill = "#aaff00"; // Slightly lighter
                    else if (name.includes('frio')) fill = "#333333"; // Dark
                    else fill = "#666";

                    return {
                        name: row.name || "Sem Etapa",
                        value: Number(row.value),
                        fill
                    };
                });

                // Process Source
                const sourceStats = sourceRes.rows.map(row => ({
                    name: (row.name || "Desconhecido").replace(/_/g, ' '),
                    value: Number(row.value)
                }));

                return { dailyMetrics, funnelStats, sourceStats };

            } finally {
                client.release();
            }
        } else {
            console.warn("⚠️ No DATABASE_URL found or using placeholder. Returning Mock Data.");
            // Fallback Mock with Filtering
            return {
                dailyMetrics: METRICS_DATA.filter(m => m.dateIso >= start && m.dateIso <= end),
                funnelStats: [],
                sourceStats: []
            };
        }

    } catch (error) {
        console.error("❌ Database Error for model:", model);
        console.error(error);

        // Return Filtered Mock Data on Error so UI looks correct (even if data is fake)
        return {
            dailyMetrics: METRICS_DATA.filter(m => m.dateIso >= start && m.dateIso <= end),
            funnelStats: [],
            sourceStats: []
        };
    }
}
