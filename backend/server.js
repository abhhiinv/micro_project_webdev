import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Routes

// User signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: result.insertId, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create paste
app.post('/api/pastes', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content required' });
    }

    const pasteUuid = uuidv4();
    const userId = req.user ? req.user.id : null;

    await pool.query(
      'INSERT INTO pastes (uuid, content, user_id) VALUES (?, ?, ?)',
      [pasteUuid, content, userId]
    );

    res.json({ uuid: pasteUuid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get paste by UUID
app.get('/api/pastes/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    const [pastes] = await pool.query(
      'SELECT id, uuid, content, created_at FROM pastes WHERE uuid = ?',
      [uuid]
    );

    if (pastes.length === 0) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    res.json(pastes[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's pastes
app.get('/api/pastes', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [pastes] = await pool.query(
      'SELECT id, uuid, content, created_at FROM pastes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(pastes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete paste
app.delete('/api/pastes/:uuid', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { uuid } = req.params;

    const [result] = await pool.query(
      'DELETE FROM pastes WHERE uuid = ? AND user_id = ?',
      [uuid, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paste not found or unauthorized' });
    }

    res.json({ message: 'Paste deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});