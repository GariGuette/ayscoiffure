const twilio = require('twilio');
const db = require('../config/database');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const generateConfirmationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const sendConfirmationSMS = async (reservation) => {
  try {
    const confirmationCode = generateConfirmationCode();
    
    const message = `Votre réservation a été enregistrée. Code de confirmation: ${confirmationCode}. Répondez avec OUI pour confirmer ou NON pour annuler.`;

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: reservation.client_phone,
    });

    // Update reservation with confirmation code
    await db.query(
      'UPDATE reservations SET confirmation_code = $1 WHERE id = $2',
      [confirmationCode, reservation.id]
    );

    // Log SMS
    await db.query(`
      INSERT INTO sms_log (reservation_id, phone_number, message, sms_type, status, twilio_sid)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [reservation.id, reservation.client_phone, message, 'confirmation', 'sent', result.sid]);

    console.log('Confirmation SMS sent:', result.sid);
    return { success: true, confirmationCode };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error.message };
  }
};

const sendReminder = async (reservation) => {
  try {
    const message = `Rappel: Vous avez une réservation demain pour "${reservation.service_name}". Merci!`;

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: reservation.client_phone,
    });

    // Update reservation
    await db.query(
      'UPDATE reservations SET reminder_sent = TRUE WHERE id = $1',
      [reservation.id]
    );

    // Log SMS
    await db.query(`
      INSERT INTO sms_log (reservation_id, phone_number, message, sms_type, status, twilio_sid)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [reservation.id, reservation.client_phone, message, 'reminder', 'sent', result.sid]);

    console.log('Reminder SMS sent:', result.sid);
    return { success: true };
  } catch (error) {
    console.error('Error sending reminder:', error);
    return { success: false, error: error.message };
  }
};

const sendCancellationSMS = async (reservation) => {
  try {
    const message = `Votre réservation a été annulée. Pour plus d'informations, veuillez nous contacter.`;

    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: reservation.client_phone,
    });

    // Log SMS
    await db.query(`
      INSERT INTO sms_log (reservation_id, phone_number, message, sms_type, status, twilio_sid)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [reservation.id, reservation.client_phone, message, 'cancellation', 'sent', result.sid]);

    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation SMS:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendConfirmationSMS,
  sendReminder,
  sendCancellationSMS,
  generateConfirmationCode,
};
