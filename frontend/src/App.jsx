import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './app.routes.jsx';

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
