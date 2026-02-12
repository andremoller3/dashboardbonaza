const { Client } = require('pg');

const originalUrl = 'postgresql://postgres:e52ab0e09070631c6e56ed49111c7274@5.161.121.187:5432/sdr_bonanza_multi_saas';

async function checkKaiyiToday() {
    console.log(`\n--- Checking Database: sdr_kaiyi_bonanza for TODAY (2026-02-12) ---`);

    // Switch to Kaiyi DB
    const url = new URL(originalUrl);
    url.pathname = '/sdr_kaiyi_bonanza';

    const client = new Client({
        connectionString: url.toString(),
        ssl: false
    });

    try {
        await client.connect();

        // Check raw counts without timezone first
        const rawQuery = `
            SELECT id, created_at
            FROM agendamentos
            WHERE created_at > '2026-02-11 20:00:00' -- roughly yesterday late to today
            ORDER BY created_at
        `;

        console.log("Checking raw records since yesterday 20:00 UTC:");
        const rawRes = await client.query(rawQuery);
        rawRes.rows.forEach(r => {
            console.log(`ID: ${r.id}, Raw: ${r.created_at.toISOString()}`);
        });

        // Check with the EXACT logic used in the app
        console.log("\nChecking with APP logic [DATE(created_at - INTERVAL '3 hours') = '2026-02-12']:");
        const appQuery = `
            SELECT 
                COUNT(id) as count
            FROM agendamentos
            WHERE DATE(created_at - INTERVAL '3 hours') >= '2026-02-12' 
              AND DATE(created_at - INTERVAL '3 hours') <= '2026-02-12'
        `;
        const appRes = await client.query(appQuery);
        console.log("App Logic Count:", appRes.rows[0].count);

    } catch (err) {
        console.error(`Error:`, err.message);
    } finally {
        await client.end();
    }
}

checkKaiyiToday();
