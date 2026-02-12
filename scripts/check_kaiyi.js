const { Client } = require('pg');

// Base connection string
const originalUrl = 'postgresql://postgres:e52ab0e09070631c6e56ed49111c7274@5.161.121.187:5432/sdr_bonanza_multi_saas';

async function checkKaiyi() {
    console.log(`\n--- Checking Database: sdr_kaiyi_bonanza with 'agendamentos' table ---`);

    // Switch to Kaiyi DB
    const url = new URL(originalUrl);
    url.pathname = '/sdr_kaiyi_bonanza';

    const client = new Client({
        connectionString: url.toString(),
        ssl: false
    });

    try {
        await client.connect();

        // Query to count for yesterday (2026-02-11)
        // Using -3h adjustment
        const query = `
            SELECT 
                COUNT(*) as count,
                MIN(created_at) as first_record,
                MAX(created_at) as last_record
            FROM agendamentos
            WHERE DATE(created_at - INTERVAL '3 hours') = '2026-02-11'
        `;

        console.log("Running Query:", query);
        const res = await client.query(query);
        console.log("Result:", res.rows[0]);

        // Also get individual rows to verify times
        const rowsQuery = `
            SELECT id, created_at, created_at - INTERVAL '3 hours' as adjusted_time
            FROM agendamentos
            WHERE DATE(created_at - INTERVAL '3 hours') = '2026-02-11'
            ORDER BY created_at
        `;
        const resRows = await client.query(rowsQuery);
        if (resRows.rows.length > 0) {
            console.log("\nFound rows:");
            resRows.rows.forEach(r => {
                const localTime = new Date(r.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                console.log(`ID: ${r.id}, CreatedAt (UTC): ${r.created_at.toISOString()}, Adjusted (Local approx): ${r.adjusted_time}, Local String: ${localTime}`);
            });
        } else {
            console.log("\nNo rows found for date 2026-02-11 with timezone adjustment.");
        }

    } catch (err) {
        console.error(`Error:`, err.message);
    } finally {
        await client.end();
    }
}

checkKaiyi();
