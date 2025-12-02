import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/booking.css';

function Booking() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/schedule/services');
        setServices(response.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, []);

  // Fetch available slots when service and date change
  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(
        `/api/reservations/available/${selectedDate}/${selectedService}`
      );
      setAvailableSlots(response.data.availableSlots);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Check if phone is blacklisted
    try {
      const blacklistCheck = await axios.get(`/api/blacklist/check/${clientPhone}`);
      if (blacklistCheck.data.isBlacklisted) {
        setError('Nous ne pouvons pas traiter votre réservation');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Error checking blacklist:', err);
    }

    try {
      const response = await axios.post('/api/reservations', {
        clientName,
        clientPhone,
        serviceId: selectedService,
        reservationDate: selectedDate,
        reservationTime: selectedTime
      });

      setSuccess('Réservation créée! Un SMS de confirmation vous a été envoyé.');
      // Reset form
      setClientName('');
      setClientPhone('');
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setAvailableSlots([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating reservation');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="booking-container">
      <div className="booking-box">
        <h1>Prendre un rendez-vous</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Votre nom:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>

          <div className="form-group">
            <label>Votre téléphone:</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+33612345678"
              required
            />
          </div>

          <div className="form-group">
            <label>Service:</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
            >
              <option value="">-- Sélectionnez un service --</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration} min) - {service.price}€
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
              required
            />
          </div>

          <div className="form-group">
            <label>Heure:</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              disabled={availableSlots.length === 0}
            >
              <option value="">
                {availableSlots.length === 0 ? '-- Pas de créneau disponible --' : '-- Sélectionnez une heure --'}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading || !selectedTime}>
            {loading ? 'Création en cours...' : 'Réserver'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
