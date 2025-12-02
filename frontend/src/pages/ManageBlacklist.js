import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function ManageBlacklist() {
  const [blacklist, setBlacklist] = useState([]);
  const [newPhone, setNewPhone] = useState('');
  const [newReason, setNewReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const fetchBlacklist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/blacklist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlacklist(response.data);
    } catch (err) {
      console.error('Error fetching blacklist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhone = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/blacklist',
        { phoneNumber: newPhone, reason: newReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Numéro ajouté à la liste rouge');
      setNewPhone('');
      setNewReason('');
      fetchBlacklist();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleRemovePhone = async (id) => {
    if (!window.confirm('Êtes-vous sûr?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `/api/blacklist/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Numéro retiré de la liste rouge');
      fetchBlacklist();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="manage-blacklist">
      <h1>Gestion de la liste rouge</h1>

      <div className="add-form">
        <h2>Ajouter un numéro</h2>
        <form onSubmit={handleAddPhone}>
          <div className="form-group">
            <label>Numéro de téléphone:</label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+33612345678"
              required
            />
          </div>

          <div className="form-group">
            <label>Raison:</label>
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Raison du blocage"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit">Ajouter</button>
        </form>
      </div>

      <div className="blacklist-table">
        <h2>Numéros bloqués</h2>
        {blacklist.length === 0 ? (
          <p>Aucun numéro dans la liste rouge</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Raison</th>
                <th>Date d'ajout</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.phone_number}</td>
                  <td>{entry.reason}</td>
                  <td>{new Date(entry.added_date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      onClick={() => handleRemovePhone(entry.id)}
                      className="btn-danger"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageBlacklist;
