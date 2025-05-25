const express = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret';

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    let user = result.rows[0];
    let role = 'admin';

    if (!user) {
      result = await pool.query('SELECT * FROM clients WHERE contactemail = $1', [email]);
      user = result.rows[0];
      role = 'client';
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
    res.json({ message: 'Login successful', role });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'strict' });
  res.json({ message: 'Logged out successfully' });
});

// Authenticated user info
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'client') {
      const result = await pool.query(
        'SELECT contactname, contactemail FROM clients WHERE id = $1',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json(result.rows[0]);
    } else if (role === 'admin') {
      const result = await pool.query(
        'SELECT email FROM admins WHERE id = $1',
        [userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Admin not found.' });
      }
      return res.json(result.rows[0]);
    } else {
      return res.status(400).json({ error: 'Invalid role.' });
    }
  } catch (error) {
    console.error('Error in /auth/me:', error);
    res.status(500).json({ error: 'Failed to fetch user info.' });
  }
});

module.exports = router;
