import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(response.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/reservations/${id}/cancel`,
        { reason: 'Cancelled by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="manage-reservations">
      <h1>Gérer les réservations</h1>
      
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Service</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.reservation_date}</td>
              <td>{res.reservation_time}</td>
              <td>{res.client_name}</td>
              <td>{res.client_phone}</td>
              <td>{res.service_name}</td>
              <td>{res.status}</td>
              <td>
                {res.status !== 'cancelled' && (
                  <button onClick={() => cancelReservation(res.id)} className="btn-danger">
                    Annuler
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageReservations;
