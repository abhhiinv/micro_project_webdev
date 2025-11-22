import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function MainPage({ user, token, onLogout, apiUrl, darkMode, toggleDarkMode }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pastes, setPastes] = useState([]);
  const [loadingPastes, setLoadingPastes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      fetchPastes();
    }
  }, [user, token]);

  const fetchPastes = async () => {
    setLoadingPastes(true);
    try {
      const response = await fetch(`${apiUrl}/pastes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPastes(data);
      }
    } catch (err) {
      console.error('Error fetching pastes:', err);
    } finally {
      setLoadingPastes(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage('Please enter some text');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/pastes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      const shareUrl = `${window.location.origin}/paste/${data.uuid}`;
      setMessage(`Text shared! Link: ${shareUrl}`);
      //setContent('');

      if (user) {
        fetchPastes();
      }

      navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm('Are you sure you want to delete this paste?')) return;

    try {
      const response = await fetch(`${apiUrl}/pastes/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPastes();
      }
    } catch (err) {
      console.error('Error deleting paste:', err);
    }
  };

  const handleCopyLink = (uuid) => {
  const shareUrl = `${window.location.origin}/paste/${uuid}`;
  navigator.clipboard.writeText(shareUrl);
  alert('Link copied to clipboard!');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand mb-0 h1">📝 Text Share</span>
          <div className="d-flex gap-2 align-items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline-secondary btn-sm"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {user ? (
              <>
                <span className="text-muted small">{user.email}</span>
                <button onClick={onLogout} className="btn btn-danger btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Editor Card */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title h4 mb-4">Share Your Text</h2>
                <form onSubmit={handleShare}>
                  <div className="mb-3">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste or write your text here..."
                      className="form-control font-monospace"
                      rows={15}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Sharing...' : '🔗 Share'}
                  </button>
                </form>
                {message && (
                  <div className="alert alert-success mt-3 mb-0" role="alert">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* History Card */}
          {user && (
            <div className="col-lg-6">
              <div className="card shadow-sm" style={{ maxHeight: '650px' }}>
                <div className="card-body p-4">
                  <h2 className="card-title h4 mb-4">Your Pastes</h2>
                  {loadingPastes ? (
                    <p className="text-muted">Loading...</p>
                  ) : pastes.length === 0 ? (
                    <p className="text-muted text-center">No pastes yet</p>
                  ) : (
                    <div 
                      className="d-flex flex-column gap-3" 
                      style={{ maxHeight: '520px', overflowY: 'auto' }}
                    >
                      {pastes.map((paste) => (
                        <div key={paste.id} className="card">
                          <div className="card-body p-3">
                            <div className="mb-2">
                              <small className="font-monospace text-break">
                                {paste.content.substring(0, 100)}
                                {paste.content.length > 100 && '...'}
                              </small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(paste.created_at).toLocaleDateString()}
                              </small>
                              <div className="d-flex gap-2">
                                <Link
                                  to={`/paste/${paste.uuid}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => handleCopyLink(paste.uuid)}
                                  className="btn btn-sm btn-outline-success"
                                >
                                  Share
                                </button>
                                <button
                                  onClick={() => handleDelete(paste.uuid)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default MainPage;
