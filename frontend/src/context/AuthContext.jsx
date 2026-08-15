import { createContext, useEffect, useMemo, useState } from 'react';
import { getMe as getMeApi, login as loginApi, clearToken as clearTokenApi } from '../services/auth.api.jsx';

export const authContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      setLoading(true);
      try {
        const response = await getMeApi();
        if (!isMounted) return;
        setUser(response.user ?? null);
      } catch (err) {
        if (!isMounted) return;
        setUser(null);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginApi(email, password);
      setUser(result.user ?? { email });
      return result;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // remove persisted token and clear user from context
    try {
      clearTokenApi();
    } catch (err) {
      // ignore errors when clearing token
      /* noop */
    }
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, error, setError, handleLogin, handleLogout }),
    [user, loading, error]
  );

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
