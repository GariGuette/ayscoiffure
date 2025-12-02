const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../config/auth');

// Admin dashboard summary
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's reservations
    const todayRes = await db.query(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
             SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM reservations
      WHERE reservation_date = $1
    `, [today]);

    // Get this week's reservations
    const weekRes = await db.query(`
      SELECT COUNT(*) as total
      FROM reservations
      WHERE reservation_date >= $1
      AND reservation_date < $2
    `, [today, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]);

    // Get total clients
    const clientsRes = await db.query(`
      SELECT COUNT(DISTINCT client_phone) as total
      FROM reservations
    `);

    // Get blacklist count
    const blacklistRes = await db.query(`
      SELECT COUNT(*) as total FROM blacklist
    `);

    res.json({
      today: todayRes.rows[0],
      thisWeek: weekRes.rows[0],
      totalClients: clientsRes.rows[0],
      blacklistedPhones: blacklistRes.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
});

// Get client history
router.get('/client/:phoneNumber', verifyToken, async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const result = await db.query(`
      SELECT r.*, s.name as service_name
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.client_phone = $1
      ORDER BY r.reservation_date DESC
    `, [phoneNumber]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client history', error: error.message });
  }
});

module.exports = router;
