const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get clients with their campaigns
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        cl.id, 
        cl.contactname, 
        cl.contactemail, 
        cl.companyname, 
        json_agg(json_build_object('id', c.id, 'title', c.title)) AS campaigns
      FROM clients cl
      LEFT JOIN campaigns c ON cl.id = c.clientid
      GROUP BY cl.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

module.exports = router;