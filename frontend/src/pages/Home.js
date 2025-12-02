import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/home.css';

function Home() {
  const [salonInfo, setSalonInfo] = useState(null);
  const [openingHours, setOpeningHours] = useState([]);

  useEffect(() => {
    fetchSalonInfo();
  }, []);

  const fetchSalonInfo = async () => {
    try {
      const [infoRes, hoursRes] = await Promise.all([
        axios.get('/api/schedule/info'),
        axios.get('/api/schedule/hours')
      ]);

      setSalonInfo(infoRes.data);
      setOpeningHours(hoursRes.data);
    } catch (err) {
      console.error('Error fetching info:', err);
    }
  };

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenue chez {salonInfo?.name || 'AYS Coiffure'}</h1>
          <p>Votre salon de coiffure de confiance</p>
          <a href="/booking" className="btn-primary">Prendre un rendez-vous</a>
        </div>
      </section>

      <section className="info-section">
        <div className="info-container">
          <div className="info-card">
            <h2>À propos</h2>
            <p>{salonInfo?.description || 'Bienvenue dans notre salon'}</p>
          </div>

          <div className="info-card">
            <h2>Contact</h2>
            <p>
              <strong>Téléphone:</strong> {salonInfo?.phone || '+33 1 23 45 67 89'}
            </p>
            <p>
              <strong>Email:</strong> {salonInfo?.email || 'contact@ayscoiffure.fr'}
            </p>
            <p>
              <strong>Adresse:</strong> {salonInfo?.address || 'Paris, France'}
            </p>
          </div>

          <div className="info-card">
            <h2>Horaires d'ouverture</h2>
            <div className="hours-list">
              {dayNames.map((day, index) => {
                const dayHours = openingHours.find(h => h.day_of_week === index);
                return (
                  <div key={index} className="hours-item">
                    <span>{day}:</span>
                    <span>
                      {dayHours?.is_closed ? 'Fermé' : `${dayHours?.opening_time} - ${dayHours?.closing_time}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
