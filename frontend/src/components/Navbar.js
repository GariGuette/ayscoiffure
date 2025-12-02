import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

function Navbar() {
  const { isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AYS Coiffure</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/booking" className="nav-link">Prendre RDV</Link>
        <Link to="/info" className="nav-link">Horaires</Link>

        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" className="nav-link admin-link">Dashboard</Link>
            <Link to="/admin/reservations" className="nav-link admin-link">Gestion RDV</Link>
            <Link to="/admin/add-reservation" className="nav-link admin-link">Ajouter RDV</Link>
            <Link to="/admin/services" className="nav-link admin-link">Services</Link>
            <Link to="/admin/blacklist" className="nav-link admin-link">Liste Rouge</Link>
            <Link to="/admin/salon" className="nav-link admin-link">Salon</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">Déconnexion</button>
          </>
        ) : (
          <Link to="/admin/login" className="nav-link login-link">Admin</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
