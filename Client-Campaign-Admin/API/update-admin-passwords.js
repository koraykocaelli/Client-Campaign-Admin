const bcrypt = require('bcrypt');
const pool = require('./db');

(async () => {
    try {
        const result = await pool.query('SELECT id, password FROM admins');

        for (const admin of result.rows) {
            const plainPassword = 'your_plain_text_password'; // Replace with actual plain text password

            const newHashedPassword = await bcrypt.hash(plainPassword, 10);

            await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [newHashedPassword, admin.id]);
            console.log(`Admin ID ${admin.id} password updated.`);
        }

        console.log('All admin passwords updated successfully!');
    } catch (err) {
        console.error('Error updating admin passwords:', err.message);
    } finally {
        pool.end();
    }
})();
