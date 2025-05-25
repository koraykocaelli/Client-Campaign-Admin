const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'your_db_user',
    host: process.env.DB_HOST || 'your_host',
    database: process.env.DB_NAME || 'your_db_name',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || your_port,
});

// Bağlantıyı test et
(async () => {
    try {
        const res = await pool.query('SELECT 1');
        console.log('Database connection successful');
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
})();

module.exports = pool;
