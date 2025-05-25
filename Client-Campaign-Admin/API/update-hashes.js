const bcrypt = require('bcrypt');
const pool = require('./db');

(async () => {
    try {
        const result = await pool.query('SELECT id, password FROM clients');

        for (const user of result.rows) {
            const plainPassword = 'your_plain_text_password'; // Replace with actual plain text password

            const newHashedPassword = await bcrypt.hash(plainPassword, 10);

            await pool.query('UPDATE clients SET password = $1 WHERE id = $2', [newHashedPassword, user.id]);
            console.log(`User ID ${user.id} password updated.`);
        }

        console.log('All passwords updated successfully!');
    } catch (err) {
        console.error('Error updating passwords:', err.message);
    } finally {
        pool.end();
    }
})();
