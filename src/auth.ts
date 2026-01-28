import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDbPool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { z } from "zod";

async function getUser(email: string) {
    try {
        const pool = getDbPool(); // Use default pool (Triton / Global) which contains the users table
        const result = await pool.query(
            `SELECT * FROM users_dashboard_carmen WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(4) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log(`🔐 Attempting login for: ${email}`);

                    const user = await getUser(email);
                    if (!user) {
                        console.log('❌ User not found in database');
                        return null;
                    }

                    console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
                    const passwordsMatch = await bcrypt.compare(password, user.password_hash);
                    console.log(`🔐 Password match result: ${passwordsMatch}`);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
