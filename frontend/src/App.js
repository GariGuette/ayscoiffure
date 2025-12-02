import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Info from './pages/Info';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManageReservations from './pages/ManageReservations';
import AddReservation from './pages/AddReservation';
import ManageBlacklist from './pages/ManageBlacklist';
import ManageServices from './pages/ManageServices';
import ManageSalon from './pages/ManageSalon';

function ProtectedRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/booking" element={<Booking />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute>
              <ManageReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-reservation"
          element={
            <ProtectedRoute>
              <AddReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blacklist"
          element={
            <ProtectedRoute>
              <ManageBlacklist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <ManageServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salon"
          element={
            <ProtectedRoute>
              <ManageSalon />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
