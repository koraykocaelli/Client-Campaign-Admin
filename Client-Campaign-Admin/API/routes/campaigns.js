const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get campaigns with client and assigned staff details, filtered by client email if provided
router.get("/", async (req, res) => {
  const { email } = req.query;

  try {
    let result;
    if (email) {
      // Filter campaigns by client email
      result = await pool.query(
        `
        SELECT 
          c.id, 
          c.title, 
          c.campaignstartdate, 
          c.campaignfinishdate, 
          c.estimatedcost, 
          cl.contactname AS clientname, 
          cl.contactemail AS clientemail, 
          (
            SELECT json_agg(
              json_build_object(
                'id', s.id,
                'staffname', s.staffname
              )
            )
            FROM staff_campaign sc
            JOIN staff s ON sc.staffid = s.id
            WHERE sc.campaignid = c.id
          ) AS assignedstaff
        FROM campaigns c
        LEFT JOIN clients cl ON c.clientid = cl.id
        WHERE cl.contactemail = $1
        `,
        [email]
      );
    } else {
      // Return all campaigns if no email filter is provided
      result = await pool.query(`
        SELECT 
          c.id, 
          c.title, 
          c.campaignstartdate, 
          c.campaignfinishdate, 
          c.estimatedcost, 
          cl.contactname AS clientname, 
          cl.contactemail AS clientemail, 
          (
            SELECT json_agg(
              json_build_object(
                'id', s.id,
                'staffname', s.staffname
              )
            )
            FROM staff_campaign sc
            JOIN staff s ON sc.staffid = s.id
            WHERE sc.campaignid = c.id
          ) AS assignedstaff
        FROM campaigns c
        LEFT JOIN clients cl ON c.clientid = cl.id
      `);
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// Add a new campaign
router.post("/", async (req, res) => {
  const { title, campaignStartDate, campaignFinishDate, estimatedCost, clientEmail } = req.body;

  if (!title || !campaignStartDate || !campaignFinishDate || !estimatedCost || !clientEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const clientResult = await pool.query("SELECT id FROM clients WHERE contactemail = $1", [clientEmail]);
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const clientId = clientResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO campaigns (title, campaignstartdate, campaignfinishdate, estimatedcost, clientid) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, campaignStartDate, campaignFinishDate, estimatedCost, clientId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding campaign:", error.message);
    res.status(500).json({ error: "Failed to add campaign" });
  }
});

// Get staff ID by email
router.get("/staff/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const staffResult = await pool.query("SELECT id FROM staff WHERE email = $1", [email]);
    if (staffResult.rows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.status(200).json({ staffId: staffResult.rows[0].id });
  } catch (error) {
    console.error("Error fetching staff ID:", error.message);
    res.status(500).json({ error: "Failed to fetch staff ID" });
  }
});

// Assign a campaign to a staff member
router.post("/assign", async (req, res) => {
  const { campaignId, staffId } = req.body;

  console.log("Received Campaign ID:", campaignId, "Staff ID:", staffId);

  if (!campaignId || !staffId) {
    console.error("Missing Campaign ID or Staff ID");
    return res.status(400).json({ error: "Both Campaign ID and Staff ID are required." });
  }

  try {
    // staff_campaign tablosuna yeni bir ilişki ekle
    await pool.query(
      `INSERT INTO staff_campaign (staffid, campaignid)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`, // Aynı kombinasyonu tekrar ekleme
      [staffId, campaignId]
    );

    // Güncellenmiş kampanyaları dön
    const updatedCampaigns = await pool.query(`
      SELECT 
        c.id, 
        c.title, 
        c.campaignstartdate, 
        c.campaignfinishdate, 
        c.estimatedcost, 
        cl.contactname AS clientname, 
        cl.contactemail AS clientemail,
        (
          SELECT json_agg(
            json_build_object(
              'id', s.id,
              'staffname', s.staffname
            )
          )
          FROM staff_campaign sc
          JOIN staff s ON sc.staffid = s.id
          WHERE sc.campaignid = c.id
        ) AS assignedstaff
      FROM campaigns c
      LEFT JOIN clients cl ON c.clientid = cl.id
    `);

    res.json(updatedCampaigns.rows);
  } catch (error) {
    console.error("Error assigning campaign:", error);
    res.status(500).json({ error: "Failed to assign campaign" });
  }
});

module.exports = router;