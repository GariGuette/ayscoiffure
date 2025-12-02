require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const db = require('./config/database');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const scheduleRoutes = require('./routes/schedule');
const smsRoutes = require('./routes/sms');
const blacklistRoutes = require('./routes/blacklist');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database tables
const initDatabase = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS salon_info (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS opening_hours (
        id SERIAL PRIMARY KEY,
        day_of_week INT (0-6, where 0 = Monday),
        opening_time TIME,
        closing_time TIME,
        is_closed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration INT,
        price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(20) NOT NULL,
        service_id INT REFERENCES services(id),
        reservation_date DATE NOT NULL,
        reservation_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        sms_sent BOOLEAN DEFAULT FALSE,
        reminder_sent BOOLEAN DEFAULT FALSE,
        confirmation_code VARCHAR(10),
        confirmed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blacklist (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL UNIQUE,
        reason TEXT,
        added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sms_log (
        id SERIAL PRIMARY KEY,
        reservation_id INT REFERENCES reservations(id),
        phone_number VARCHAR(20),
        message TEXT,
        sms_type VARCHAR(50),
        status VARCHAR(50),
        twilio_sid VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_user (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// SMS reminder job - runs every day at 10:00 AM
cron.schedule('0 10 * * *', async () => {
  console.log('Running daily SMS reminder job...');
  try {
    // Query reservations for tomorrow that haven't been reminded
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = await db.query(`
      SELECT r.*, s.name as service_name
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      WHERE r.reservation_date = $1
      AND r.reminder_sent = FALSE
      AND r.status = 'confirmed'
    `, [tomorrow.toISOString().split('T')[0]]);

    // Send SMS reminders
    const smsModule = require('./services/smsService');
    for (const reservation of result.rows) {
      await smsModule.sendReminder(reservation);
    }
  } catch (error) {
    console.error('Error in SMS reminder job:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initDatabase();
});

module.exports = app;
