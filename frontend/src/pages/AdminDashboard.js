import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin-dashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [todayReservations, setTodayReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, todayRes] = await Promise.all([
        axios.get('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/reservations/today', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats(statsRes.data);
      setTodayReservations(todayRes.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Réservations aujourd'hui</h3>
          <p className="stat-number">{stats?.today.total || 0}</p>
          <p className="stat-detail">Confirmées: {stats?.today.confirmed || 0}</p>
          <p className="stat-detail">En attente: {stats?.today.pending || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Cette semaine</h3>
          <p className="stat-number">{stats?.thisWeek.total || 0}</p>
          <p className="stat-detail">réservations</p>
        </div>

        <div className="stat-card">
          <h3>Clients totaux</h3>
          <p className="stat-number">{stats?.totalClients.total || 0}</p>
          <p className="stat-detail">clients uniques</p>
        </div>

        <div className="stat-card">
          <h3>Liste rouge</h3>
          <p className="stat-number">{stats?.blacklistedPhones.total || 0}</p>
          <p className="stat-detail">numéros bloqués</p>
        </div>
      </div>

      <div className="reservations-section">
        <h2>Réservations d'aujourd'hui</h2>
        {todayReservations.length === 0 ? (
          <p>Aucune réservation pour aujourd'hui</p>
        ) : (
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Heure</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Service</th>
                <th>Durée</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {todayReservations.map((res) => (
                <tr key={res.id} className={`status-${res.status}`}>
                  <td>{res.reservation_time}</td>
                  <td>{res.client_name}</td>
                  <td>{res.client_phone}</td>
                  <td>{res.service_name}</td>
                  <td>{res.duration} min</td>
                  <td>{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
