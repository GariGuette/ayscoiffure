import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function ManageSalon() {
  const [salonInfo, setSalonInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: ''
  });
  const [openingHours, setOpeningHours] = useState({
    0: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    1: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    2: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    3: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    4: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    5: { opening_time: '09:00', closing_time: '18:00', is_closed: false },
    6: { opening_time: '10:00', closing_time: '16:00', is_closed: false }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [infoRes, hoursRes] = await Promise.all([
        axios.get('/api/schedule/info'),
        axios.get('/api/schedule/hours', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSalonInfo(infoRes.data);
      
      const hoursMap = {};
      hoursRes.data.forEach(hour => {
        hoursMap[hour.day_of_week] = hour;
      });
      setOpeningHours(prev => ({ ...prev, ...hoursMap }));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalonChange = (e) => {
    const { name, value } = e.target;
    setSalonInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHourChange = (day, field, value) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSalon = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/schedule/info',
        salonInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Informations du salon mises à jour');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      for (let day = 0; day < 7; day++) {
        await axios.put(
          `/api/schedule/hours/${day}`,
          openingHours[day],
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSuccess('Horaires mis à jour');
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="manage-salon">
      <h1>Gestion du salon</h1>

      <div className="section">
        <h2>Informations du salon</h2>
        <form onSubmit={handleSaveSalon}>
          <div className="form-group">
            <label>Nom:</label>
            <input
              type="text"
              name="name"
              value={salonInfo.name}
              onChange={handleSalonChange}
            />
          </div>

          <div className="form-group">
            <label>Téléphone:</label>
            <input
              type="tel"
              name="phone"
              value={salonInfo.phone}
              onChange={handleSalonChange}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={salonInfo.email}
              onChange={handleSalonChange}
            />
          </div>

          <div className="form-group">
            <label>Adresse:</label>
            <textarea
              name="address"
              value={salonInfo.address}
              onChange={handleSalonChange}
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={salonInfo.description}
              onChange={handleSalonChange}
            />
          </div>

          <button type="submit">Enregistrer les informations</button>
        </form>
      </div>

      <div className="section">
        <h2>Horaires d'ouverture</h2>
        <form onSubmit={handleSaveHours}>
          {dayNames.map((day, index) => (
            <div key={index} className="hours-row">
              <label>{day}:</label>
              <input
                type="checkbox"
                checked={openingHours[index]?.is_closed || false}
                onChange={(e) => handleHourChange(index, 'is_closed', e.target.checked)}
              />
              <span>Fermé</span>
              
              {!openingHours[index]?.is_closed && (
                <>
                  <input
                    type="time"
                    value={openingHours[index]?.opening_time || '09:00'}
                    onChange={(e) => handleHourChange(index, 'opening_time', e.target.value)}
                  />
                  <span>à</span>
                  <input
                    type="time"
                    value={openingHours[index]?.closing_time || '18:00'}
                    onChange={(e) => handleHourChange(index, 'closing_time', e.target.value)}
                  />
                </>
              )}
            </div>
          ))}

          <button type="submit">Enregistrer les horaires</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
}

export default ManageSalon;
