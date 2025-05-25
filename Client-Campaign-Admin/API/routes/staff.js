const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all staff with assigned campaigns
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS staffid, 
        s.staffname, 
        s.staffemailaddress,
        json_agg(json_build_object('id', c.id, 'title', c.title)) AS assignedcampaigns
      FROM staff s
      LEFT JOIN staff_campaign sc ON s.id = sc.staffid
      LEFT JOIN campaigns c ON sc.campaignid = c.id
      GROUP BY s.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

module.exports = router;