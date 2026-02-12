const { Client } = require('pg');

const originalUrl = 'postgresql://postgres:e52ab0e09070631c6e56ed49111c7274@5.161.121.187:5432/sdr_bonanza_multi_saas';

async function diagnose() {
    console.log(`\n--- Diagnostic for Kaiyi DB ---`);
    const url = new URL(originalUrl);
    url.pathname = '/sdr_kaiyi_bonanza';

    // Connect to setup timezone explicitly if needed, but let's test default first
    const client = new Client({ connectionString: url.toString(), ssl: false });

    try {
        await client.connect();

        // 1. Check Server Timezone
        const tzRes = await client.query("SHOW TIMEZONE");
        const nowRes = await client.query("SELECT NOW() as now_db");
        console.log(`DB Timezone: ${tzRes.rows[0].TimeZone}`);
        console.log(`DB Now: ${nowRes.rows[0].now_db}`);

        // 2. Fetch the controversial record ID 103 again with explicit casting
        const recRes = await client.query(`
            SELECT 
                id, 
                created_at, 
                created_at AT TIME ZONE 'UTC' as created_at_utc,
                created_at - INTERVAL '3 hours' as minus_3h_calc,
                DATE(created_at - INTERVAL '3 hours') as date_minus_3h
            FROM agendamentos 
            WHERE id = 103
        `);

        if (recRes.rows.length > 0) {
            console.log("\nRecord 103 Analysis:");
            console.log(recRes.rows[0]);
        } else {
            console.log("\nRecord 103 not found?");
        }

        // 3. Check for any records created AFTER 02:45 AM (05:45 UTC) today
        const todayRes = await client.query(`
            SELECT id, created_at 
            FROM agendamentos 
            WHERE created_at > '2026-02-12 06:00:00'
        `);

        console.log(`\nRecords after 06:00 UTC today: ${todayRes.rowCount}`);
        if (todayRes.rowCount > 0) console.log(todayRes.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

diagnose();
