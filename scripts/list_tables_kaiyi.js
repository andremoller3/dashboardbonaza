const { Client } = require('pg');

const url = 'postgresql://postgres:e52ab0e09070631c6e56ed49111c7274@5.161.121.187:5432/sdr_kaiyi_bonanza';

async function main() {
    const client = new Client({ connectionString: url });
    try {
        await client.connect();

        console.log("Connected to sdr_kaiyi_bonanza. Querying tables...");

        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'agendamento%'
        `);

        console.log("Tables found:");
        res.rows.forEach(row => console.log(row.table_name));

        const allRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log("\nAll Tables:");
        // allRes.rows.forEach(row => console.log(row.table_name)); // Uncomment if no match found
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

main();
