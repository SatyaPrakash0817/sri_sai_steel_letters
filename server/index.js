import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(bodyParser.json());

// Return JSON when request bodies contain invalid JSON.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  return next(err);
});

// Nodemailer SMTP configuration
let transporter = null;
let emailMode = 'disabled';
let mailerError = null;

const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;
const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '');
const EMAIL_FROM = (process.env.EMAIL_FROM || smtpUser || 'noreply@srisaisteel.com').trim();

const initializeMailer = (async () => {
  if (!smtpUser || !smtpPass) {
    mailerError = 'SMTP credentials missing. Set SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASSWORD.';
    console.warn(`[MAIL] ${mailerError}`);
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    await transporter.verify();
    emailMode = 'smtp';
    mailerError = null;
    console.log(`[MAIL] SMTP ready (${smtpHost}:${smtpPort}, secure=${smtpSecure})`);
  } catch (err) {
    transporter = null;
    emailMode = 'disabled';
    mailerError = err.message || 'SMTP initialization failed';
    console.error(`[MAIL] SMTP setup failed: ${mailerError}`);
  }
})();

// In-memory OTP storage (for demo; use Redis in production)
const otpStorage = new Map();

// MySQL connection pool
// Railway provides MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLDATABASE, MYSQLPASSWORD
// Also support standard DB_HOST, DB_USER, DB_PASSWORD, DB_NAME format
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'srisai_steel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and tables
async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create users table with phone field
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create messages table for storing contact form submissions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    
    // Add phone column if it doesn't exist (for existing databases)
    try {
      await connection.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`);
    } catch (err) {
      // Column already exists, ignore error
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    connection.release();
  }
}

initDatabase();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Generate random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  await initializeMailer;

  if (!transporter || emailMode !== 'smtp') {
    return res.status(503).json({
      message: 'Email service is not configured. Please configure SMTP credentials in server .env.'
    });
  }

  // Generate OTP and store it
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
  
  // Send OTP via email
  try {
    const emailContent = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Sri Sai Steel Letters - Your OTP Code',
      text: `Your OTP for Sri Sai Steel Letters is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="color: #666; margin-bottom: 20px;">Your One-Time Password (OTP) for Sri Sai Steel Letters registration:</p>
            <div style="background-color: #4F46E5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: white; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 12px;">This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `
    };

    let mailResponse = null;
    let lastError = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        mailResponse = await transporter.sendMail(emailContent);
        break;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    if (!mailResponse) {
      throw lastError || new Error('Unable to send email');
    }

    // Store OTP only after successful email delivery request.
    otpStorage.set(email, { otp, expiresAt });

    if (process.env.NODE_ENV === 'production') {
      console.log(`[EMAIL] OTP sent to ${email}`);
    } else {
      console.log(`[EMAIL] OTP sent to ${email}: ${otp}`);
    }

    res.json({ message: 'OTP sent to email successfully' });
  } catch (err) {
    console.error('Email sending error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Register endpoint (with OTP verification)
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password, otp } = req.body;
  
  if (!email || !password || !phone || !otp) {
    return res.status(400).json({ message: 'All fields required' });
  }

  // Verify OTP using email key
  const storedOtp = otpStorage.get(email);
  if (!storedOtp) {
    return res.status(400).json({ message: 'OTP not found or expired' });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (Date.now() > storedOtp.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ message: 'OTP expired' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO users (name, email, phone, password, is_admin) VALUES (?, ?, ?, ?, ?)',
      [name || '', email, phone, hashed, false]
    );
    connection.release();
    
    // Clear used OTP
    otpStorage.delete(email);
    
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Login failed' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (rows.length === 0 || !rows[0].is_admin) {
      return res.status(403).json({ message: 'Admin access denied' });
    }

    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, is_admin: true }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Admin login failed' });
  }
});

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Unauthorized' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get current user info
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Get all users (admin only)
app.get('/api/admin/users', authMiddleware, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Admin access required' });

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC');
    
    // Fetch messages for each user
    const usersWithMessages = await Promise.all(users.map(async (user) => {
      const [messages] = await connection.query(
        'SELECT id, subject, message, created_at FROM messages WHERE user_id = ? ORDER BY created_at DESC',
        [user.id]
      );
      return { ...user, messages };
    }));
    
    connection.release();
    res.json({ users: usersWithMessages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user profile (authenticated users)
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, name, email, phone, created_at FROM users WHERE id = ?', [req.user.id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user profile (name, phone)
app.put('/api/profile/update', authMiddleware, async (req, res) => {
  const { name, phone } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }
  
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone, req.user.id]
    );
    
    const [rows] = await connection.query('SELECT id, name, email, phone FROM users WHERE id = ?', [req.user.id]);
    connection.release();
    
    res.json({ message: 'Profile updated successfully', user: rows[0] });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Update failed' });
  }
});

// Change password
app.post('/api/password/change', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords required' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = rows[0];
    const isValid = bcrypt.compareSync(currentPassword, user.password);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    const connection2 = await pool.getConnection();
    await connection2.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id]);
    connection2.release();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Password change failed' });
  }
});

// Save contact message (authenticated or public)
app.post('/api/messages', authMiddleware, async (req, res) => {
  const { subject, message, name, email, phone } = req.body;
  
  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const connection = await pool.getConnection();

    const [profileRows] = await connection.query(
      'SELECT name, email, phone FROM users WHERE id = ?',
      [req.user.id]
    );

    const profile = profileRows[0] || {};
    const senderName = String(name || profile.name || 'User').trim();
    const senderEmail = String(email || profile.email || req.user.email || '').trim();
    const senderPhone = String(phone || profile.phone || '').trim();
    const normalizedSubject = String(subject || 'Contact Form Message').trim();
    const normalizedMessage = String(message).trim();

    if (!senderEmail) {
      connection.release();
      return res.status(400).json({ message: 'Email is required to save message' });
    }

    const [result] = await connection.query(
      'INSERT INTO messages (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, senderName, senderEmail, senderPhone, normalizedSubject, normalizedMessage]
    );
    connection.release();

    console.log(`[CONTACT] Message saved. user_id=${req.user.id}, message_id=${result.insertId}`);
    
    res.json({ 
      message: 'Message saved successfully',
      messageId: result.insertId 
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to save message' });
  }
});

// Health check endpoint (for monitoring/deployment verification)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Sri Sai Steel Letters API'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  
  console.log(`[STATIC] Serving static files from: ${distPath}`);
  
  // Serve static assets (CSS, JS, images)
  app.use(express.static(distPath));
  
  // Serve index.html for all non-API routes (enables client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Connect to MySQL and start server
async function startServer() {
  try {
    console.log('Starting server...');
    console.log('PORT:', PORT);
    console.log('HOST:', HOST);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DB_HOST:', process.env.DB_HOST ? 'Set' : 'Not set');
    console.log('MYSQLHOST:', process.env.MYSQLHOST ? 'Set' : 'Not set');
    
    console.log('Connecting to MySQL...');
    await initDatabase();
    console.log('MySQL connected successfully!');
    
    // Wait for email service to initialize
    console.log('Initializing email service...');
    await initializeMailer;
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
      console.log(`✅ Health check: http://0.0.0.0:${PORT}/api/health`);
    });
    
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
    
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Error details:', err);
    
    // Try to start server anyway without DB for health checks
    console.log('⚠️  Starting server without database...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  Server running in degraded mode at http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();
