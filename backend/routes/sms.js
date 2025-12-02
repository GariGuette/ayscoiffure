const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../config/auth');
const smsService = require('../services/smsService');

// Send SMS (admin)
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { reservationId, message, smsType } = req.body;

    const result = await db.query(
      'SELECT * FROM reservations WHERE id = $1',
      [reservationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // Log SMS
    await db.query(`
      INSERT INTO sms_log (reservation_id, phone_number, message, sms_type, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [reservationId, reservation.client_phone, message, smsType || 'manual', 'pending']);

    res.json({ message: 'SMS queued for sending' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending SMS', error: error.message });
  }
});

// Get SMS logs (admin)
router.get('/logs', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM sms_log ORDER BY created_at DESC LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SMS logs', error: error.message });
  }
});

// Get SMS logs for specific reservation (admin)
router.get('/logs/:reservationId', verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM sms_log WHERE reservation_id = $1 ORDER BY created_at DESC
    `, [reservationId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching SMS logs', error: error.message });
  }
});

module.exports = router;
