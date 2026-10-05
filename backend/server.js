const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3006;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ─── GET /api/users ───────────────────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check duplicate email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists' });
    }

    const now = new Date().toISOString();
    const stmt = db.prepare(
      'INSERT INTO users (name, email, created_at, updated_at) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name.trim(), email.trim().toLowerCase(), now, now);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check user exists
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check duplicate email (excluding current user)
    const duplicate = db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .get(email.trim().toLowerCase(), id);
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists' });
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?').run(
      name.trim(),
      email.trim().toLowerCase(),
      now,
      id
    );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ success: true, message: 'User deleted successfully', data: { id: parseInt(id) } });
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📦 Database ready`);
});
