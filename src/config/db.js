const pkg = require('@prisma/client');
const { PrismaClient } = pkg;
const { Pool } = require('pg'); // ← Pool instead of Client
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

// Pool automatically manages connections and reconnects
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,                  // max connections in pool
    idleTimeoutMillis: 30000, // close idle connections after 30s
    connectionTimeoutMillis: 10000, // timeout if can't get connection in 10s
});

const adapter = new PrismaPg(pool); // ← pass pool to adapter
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
    try {
        // Test the connection with a simple query, useful to check the connection with database
        await pool.query('SELECT 1');
        await prisma.$connect();
        console.log("DB Connected via Prisma");
    } catch (error) {
        if (error instanceof AggregateError) {
            console.error("Connection errors:", error.errors);
        } else {
            console.error(`Database Connection Failed: `, error);
        }
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
    await pool.end();
};

module.exports = { prisma, connectDB, disconnectDB };