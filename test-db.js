require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function testConnection() {
    console.log("Testing connection to:", process.env.DATABASE_URL.split('@')[1]); // Hide password

    try {
        const client = await pool.connect();
        console.log("✅ Connection successful!");

        // Test the specific query logic for Yesterday (2026-01-26 based on screenshot)
        const testDate = '2026-01-26';

        const res = await client.query(`
      SELECT 
        DATE(data_atualizacao) as "dateIso",
        COUNT(*) as leads
      FROM leads
      WHERE DATE(data_atualizacao) = $1::date
      GROUP BY DATE(data_atualizacao)
    `, [testDate]);

        console.log(`\nResults for ${testDate}:`);
        if (res.rows.length === 0) {
            console.log("No rows found (count: 0)");
        } else {
            console.table(res.rows);
        }

        client.release();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
