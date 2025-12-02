const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../config/auth');

// Get all blacklisted phone numbers (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM blacklist ORDER BY added_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blacklist', error: error.message });
  }
});

// Add phone to blacklist (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { phoneNumber, reason } = req.body;

    const result = await db.query(`
      INSERT INTO blacklist (phone_number, reason)
      VALUES ($1, $2)
      RETURNING *
    `, [phoneNumber, reason || 'No reason provided']);

    res.status(201).json({
      message: 'Phone number added to blacklist',
      blacklistEntry: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ message: 'Phone number already in blacklist' });
    }
    res.status(500).json({ message: 'Error adding to blacklist', error: error.message });
  }
});

// Remove from blacklist (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM blacklist WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blacklist entry not found' });
    }

    res.json({ message: 'Phone number removed from blacklist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from blacklist', error: error.message });
  }
});

// Check if phone is blacklisted (public)
router.get('/check/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const result = await db.query(
      'SELECT id FROM blacklist WHERE phone_number = $1',
      [phoneNumber]
    );

    res.json({ 
      isBlacklisted: result.rows.length > 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking blacklist', error: error.message });
  }
});

module.exports = router;
