import { Pool } from 'pg';

const pools = new Map<string, Pool>();

export function getDbPool(model?: string): Pool {
    // Determine target database name based on model
    // Default: use the one in the connection string
    let targetDbName: string | null = null;

    if (model === 'fuso') {
        targetDbName = 'sdr_fuso_bonanza';
    } else if (model === 'kaiyi') {
        targetDbName = 'sdr_kaiyi_bonanza';
    }

    const cacheKey = targetDbName || 'default';

    if (pools.has(cacheKey)) {
        return pools.get(cacheKey)!;
    }

    let connectionString = process.env.DATABASE_URL;

    if (targetDbName && connectionString) {
        try {
            // Parse and replace database name
            const url = new URL(connectionString);
            url.pathname = `/${targetDbName}`;
            connectionString = url.toString();
            console.log(`🔌 Creating new DB Pool for: ${targetDbName}`);
        } catch (e) {
            console.error("Failed to parse DATABASE_URL for dynamic switching", e);
        }
    }

    const pool = new Pool({
        connectionString,
        // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
        ssl: undefined // Forcing no SSL to match user's VPS setup
    });

    pools.set(cacheKey, pool);
    return pool;
}

// Keep default export for backward compatibility if needed, 
// ensuring it returns the default pool
export default getDbPool();
