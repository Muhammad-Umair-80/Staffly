import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hooks.js';
import '../styles/login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error, setError, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    setError(null);

    try {
      await handleLogin(email.trim(), password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-split-layout">
        {/* Left Branding Hero Panel */}
        <div className="login-hero-panel">
          <div className="login-brand-logo">
            <div className="login-brand-logo__badge">S</div>
            <span className="login-brand-logo__title">Staffly</span>
          </div>

          <div className="login-hero-content">
            <h2>Streamline your workforce &amp; team operations.</h2>
            <p>Empower your HR administration with modern team directory tracking, project management, performance feedback, and secure record storage.</p>
          </div>

          <div className="login-hero-footer">
            &copy; {new Date().getFullYear()} Staffly Inc. All rights reserved.
          </div>
        </div>

        {/* Right Form Card Panel */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card__header">
              <h1>Admin Sign In</h1>
              <p>Enter your administrative account credentials to continue.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@staffly.com"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {localError && (
                <div className="login-error-badge">
                  {localError}
                </div>
              )}

              <button type="submit" className="login-submit-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;