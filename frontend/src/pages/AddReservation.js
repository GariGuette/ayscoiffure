import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function AddReservation() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    reservationDate: '',
    reservationTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/reservations/admin/manual',
        {
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          serviceId: formData.serviceId,
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Réservation ajoutée avec succès!');
      setFormData({
        clientName: '',
        clientPhone: '',
        serviceId: '',
        reservationDate: '',
        reservationTime: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="add-reservation">
      <h1>Ajouter une réservation manuellement</h1>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Nom du client:</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Téléphone:</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Service:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionnez un service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}€
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
          <label>Heure:</label>
          <input
            type="time"
            name="reservationTime"
            value={formData.reservationTime}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter la réservation'}
        </button>
      </form>
    </div>
  );
}

export default AddReservation;
