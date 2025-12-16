import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLogin, apiUrl, darkMode, toggleDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="btn btn-outline-secondary position-fixed top-0 end-0 m-3"
        style={{ zIndex: 1050 }}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Gradient App Name */}
      <div className="position-absolute w-100 text-center" style={{ top: '10%' }}>
        <h1
          className="display-1 fw-bold mb-0"
          style={{
            background: 'linear-gradient(135deg, #264291ff 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '4.5rem',
            letterSpacing: '2px'
          }}
        >
          TEXT SHARE
        </h1>
        <p className="text-muted fs-5 mt-2 fw-semibold"
          style={{
            background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '2px'
          }}
        >Share your text with the world</p>
      </div>
      {/* Login Card */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <p className="text-muted mb-2">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </p>
                  <p className="text-muted mb-0">
                    <Link to="/">Continue as guest</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;