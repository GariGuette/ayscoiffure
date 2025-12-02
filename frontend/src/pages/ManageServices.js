import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/schedule/services');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/schedule/services',
        newService,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Service ajouté avec succès');
      setNewService({ name: '', description: '', duration: '', price: '' });
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="manage-services">
      <h1>Gestion des services</h1>

      <div className="add-form">
        <h2>Ajouter un service</h2>
        <form onSubmit={handleAddService}>
          <div className="form-group">
            <label>Nom:</label>
            <input
              type="text"
              name="name"
              value={newService.name}
              onChange={handleChange}
              placeholder="Ex: Coupe Homme"
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={newService.description}
              onChange={handleChange}
              placeholder="Description du service"
            />
          </div>

          <div className="form-group">
            <label>Durée (minutes):</label>
            <input
              type="number"
              name="duration"
              value={newService.duration}
              onChange={handleChange}
              placeholder="30"
              required
            />
          </div>

          <div className="form-group">
            <label>Prix (€):</label>
            <input
              type="number"
              name="price"
              value={newService.price}
              onChange={handleChange}
              placeholder="15.00"
              step="0.01"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit">Ajouter le service</button>
        </form>
      </div>

      <div className="services-list">
        <h2>Services disponibles</h2>
        {services.length === 0 ? (
          <p>Aucun service</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Durée</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{service.duration} min</td>
                  <td>{service.price}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageServices;
