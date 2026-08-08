import { useContext } from 'react';
import { authContext } from '../context/AuthContext.jsx';

export function useAuth() {
  const context = useContext(authContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}

        
