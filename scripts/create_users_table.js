const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' }); // Load env from current dir (root)

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log('🔌 Connected to database...');

        // 1. Create Table
        console.log('🛠 Creating table users_dashboard_carmen...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users_dashboard_carmen (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Table created successfully.');

        // 2. Create Admin User
        const email = 'admin@dashboard.com';
        const password = 'Carmen#Secure$2026'; // New complex password
        const passwordHash = await bcrypt.hash(password, 10);

        console.log(`👤 Creating default user: ${email}`);

        // Insert or Update (Upsert) to avoid duplicates
        await client.query(`
            INSERT INTO users_dashboard_carmen (email, password_hash, name)
            VALUES ($1, $2, 'Admin User')
            ON CONFLICT (email) 
            DO UPDATE SET password_hash = $2;
        `, [email, passwordHash]);

        console.log('✅ Admin user created/updated.');
        console.log(`🔐 Credentials: ${email} / ${password}`);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
