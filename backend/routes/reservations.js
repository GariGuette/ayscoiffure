const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../config/auth');
const smsService = require('../services/smsService');

// Get all reservations (admin)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, s.name as service_name, s.duration, s.price
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
});

// Get today's reservations
router.get('/today', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.query(`
      SELECT r.*, s.name as service_name, s.duration, s.price
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.reservation_date = $1
      ORDER BY r.reservation_time ASC
    `, [today]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today reservations', error: error.message });
  }
});

// Get available slots for a date
router.get('/available/:date/:serviceId', async (req, res) => {
  try {
    const { date, serviceId } = req.params;
    
    // Get service duration
    const serviceResult = await db.query('SELECT duration FROM services WHERE id = $1', [serviceId]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const serviceDuration = serviceResult.rows[0].duration;
    
    // Get existing reservations for that date
    const reservations = await db.query(`
      SELECT reservation_time, duration
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.reservation_date = $1 AND r.status = 'confirmed'
    `, [date]);

    // Generate available slots (e.g., 09:00 to 18:00 in 30-min intervals)
    const availableSlots = generateAvailableSlots(
      reservations.rows,
      serviceDuration
    );

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
});

// Create reservation
router.post('/', async (req, res) => {
  try {
    const { clientName, clientPhone, serviceId, reservationDate, reservationTime } = req.body;

    // Check if phone is blacklisted
    const blacklistCheck = await db.query(
      'SELECT id FROM blacklist WHERE phone_number = $1',
      [clientPhone]
    );

    if (blacklistCheck.rows.length > 0) {
      return res.status(403).json({ 
        message: 'This phone number cannot book reservations' 
      });
    }

    // Create reservation
    const result = await db.query(`
      INSERT INTO reservations (client_name, client_phone, service_id, reservation_date, reservation_time, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `, [clientName, clientPhone, serviceId, reservationDate, reservationTime]);

    const reservation = result.rows[0];

    // Send confirmation SMS
    const smsResult = await smsService.sendConfirmationSMS(reservation);

    res.status(201).json({
      message: 'Reservation created. Confirmation SMS sent.',
      reservation,
      smsStatus: smsResult.success
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
});

// Confirm reservation (admin adds manually or client confirms)
router.put('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    const result = await db.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // Verify confirmation code if provided
    if (confirmationCode && confirmationCode !== reservation.confirmation_code) {
      return res.status(401).json({ message: 'Invalid confirmation code' });
    }

    // Update status
    const updateResult = await db.query(
      'UPDATE reservations SET status = $1, confirmed = TRUE, sms_sent = TRUE WHERE id = $2 RETURNING *',
      ['confirmed', id]
    );

    res.json({ 
      message: 'Reservation confirmed',
      reservation: updateResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming reservation', error: error.message });
  }
});

// Cancel reservation (admin)
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await db.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // Send cancellation SMS
    await smsService.sendCancellationSMS(reservation);

    // Update status
    const updateResult = await db.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      ['cancelled', id]
    );

    res.json({ 
      message: 'Reservation cancelled and SMS sent',
      reservation: updateResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
  }
});

// Add reservation manually (admin)
router.post('/admin/manual', verifyToken, async (req, res) => {
  try {
    const { clientName, clientPhone, serviceId, reservationDate, reservationTime } = req.body;

    const result = await db.query(`
      INSERT INTO reservations (client_name, client_phone, service_id, reservation_date, reservation_time, status, confirmed)
      VALUES ($1, $2, $3, $4, $5, 'confirmed', TRUE)
      RETURNING *
    `, [clientName, clientPhone, serviceId, reservationDate, reservationTime]);

    const reservation = result.rows[0];

    // Optionally send notification SMS
    const message = `Votre réservation a été enregistrée. Merci!`;
    await db.query(`
      INSERT INTO sms_log (reservation_id, phone_number, message, sms_type, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [reservation.id, clientPhone, message, 'notification', 'pending']);

    res.status(201).json({
      message: 'Reservation added successfully',
      reservation
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding reservation', error: error.message });
  }
});

// Helper function to generate available slots
function generateAvailableSlots(existingReservations, serviceDuration) {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  const slotDuration = 30; // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      
      // Check if slot is available
      const isAvailable = !existingReservations.some(res => {
        const resTime = res.reservation_time.substring(0, 5);
        const resEnd = addMinutes(resTime, res.duration);
        const slotEnd = addMinutes(timeStr, serviceDuration);
        
        return timeStr >= resTime && timeStr < resEnd || slotEnd > resTime && slotEnd <= resEnd;
      });

      if (isAvailable) {
        slots.push(timeStr);
      }
    }
  }

  return slots;
}

function addMinutes(timeStr, minutes) {
  const [hours, mins] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

module.exports = router;
