import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DIRECT_URL!);