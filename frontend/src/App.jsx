import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainPage from './components/MainPage';
import ViewPaste from './components/ViewPaste';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  }, [token]);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Login 
              onLogin={handleLogin} 
              apiUrl={API_URL}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup 
              onSignup={handleLogin} 
              apiUrl={API_URL}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/"
          element={
            <MainPage
              user={user}
              token={token}
              onLogout={handleLogout}
              apiUrl={API_URL}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/paste/:uuid"
          element={
            <ViewPaste 
              apiUrl={API_URL}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;