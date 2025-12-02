const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../config/auth');

// Get all services
router.get('/services', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Add service (admin)
router.post('/services', verifyToken, async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    const result = await db.query(`
      INSERT INTO services (name, description, duration, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, description, duration, price]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding service', error: error.message });
  }
});

// Get opening hours
router.get('/hours', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM opening_hours ORDER BY day_of_week ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hours', error: error.message });
  }
});

// Update opening hours (admin)
router.put('/hours/:day', verifyToken, async (req, res) => {
  try {
    const { day } = req.params;
    const { opening_time, closing_time, is_closed } = req.body;

    const result = await db.query(`
      INSERT INTO opening_hours (day_of_week, opening_time, closing_time, is_closed)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (day_of_week) DO UPDATE SET
        opening_time = $2,
        closing_time = $3,
        is_closed = $4
      RETURNING *
    `, [day, opening_time, closing_time, is_closed]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating hours', error: error.message });
  }
});

// Get salon info
router.get('/info', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM salon_info LIMIT 1');
    if (result.rows.length === 0) {
      // Return default info
      return res.json({
        name: process.env.SALON_NAME || 'AYS Coiffure',
        phone: process.env.SALON_PHONE || '+33123456789',
        email: process.env.SALON_EMAIL || 'contact@ayscoiffure.fr'
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching salon info', error: error.message });
  }
});

// Update salon info (admin)
router.put('/info', verifyToken, async (req, res) => {
  try {
    const { name, phone, email, address, description } = req.body;

    const result = await db.query(`
      INSERT INTO salon_info (name, phone, email, address, description)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = $1,
        phone = $2,
        email = $3,
        address = $4,
        description = $5
      RETURNING *
    `, [name, phone, email, address, description]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating salon info', error: error.message });
  }
});

module.exports = router;
