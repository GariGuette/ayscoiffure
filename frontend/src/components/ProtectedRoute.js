import React from 'react';

function ProtectedRoute({ isAdmin, children }) {
  return isAdmin ? children : null;
}

export default ProtectedRoute;
