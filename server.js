const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');
try { require('dotenv').config(); } catch (_) {}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));
let dbApi;

const heroSets = [
  {
    title: 'ML/AL Architecture',
    subtitle: "Enter the next dimension of digital innovation"
  },
  {
    title: 'Cybersecurity Training',
    subtitle: 'Where technology meets infinite possibilities'
  },
  {
    title: 'Cloud Architecture',
    subtitle: "Powering tomorrow's digital revolution today"
  }
];

const features = [
  {
    id: 'performance',
    name: 'Performance',
    title: 'Lightning Fast Performance',
    description:
      'Experience unprecedented speed with our quantum-powered infrastructure. Built on cutting-edge technology that delivers results at the speed of thought.',
    items: [
      'Sub-millisecond response times',
      '99.99% uptime guarantee',
      'Automatic scaling based on demand',
      'Real-time data synchronization'
    ]
  },
  {
    id: 'security',
    name: 'Security',
    title: 'Military-Grade Security',
    description:
      'Your data is protected by the most advanced encryption protocols available. Multi-layered security ensures complete protection against cyber threats.',
    items: [
      '256-bit AES encryption',
      'Biometric authentication',
      'Zero-knowledge architecture',
      'Real-time threat detection',
      'Automated security updates'
    ]
  },
  {
    id: 'network',
    name: 'Network',
    title: 'Global Neural Network',
    description:
      'Connect to our worldwide infrastructure that spans across continents. Seamless integration with existing systems and future-proof architecture.',
    items: [
      '200+ global data centers',
      'Intelligent routing algorithms',
      'Cross-platform compatibility',
      '5G and satellite connectivity',
      'Decentralized architecture'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    title: 'Advanced Analytics',
    description:
      'Harness the power of AI-driven insights to make data-driven decisions. Real-time analytics and predictive modeling at your fingertips.',
    items: [
      'Machine learning algorithms',
      'Predictive analytics',
      'Custom dashboard creation',
      'Real-time data visualization',
      'Automated reporting'
    ]
  },
  {
    id: 'integration',
    name: 'Integration',
    title: 'Seamless Integration',
    description:
      'Connect with thousands of apps and services through our universal API. Built to work with your existing tools and workflows.',
    items: [
      'RESTful API architecture',
      'WebSocket support',
      'SDK for major platforms',
      'One-click integrations',
      'Custom webhook support'
    ]
  }
];

app.get('/api/hero', (req, res) => {
  res.json(heroSets);
});

app.get('/api/features', (req, res) => {
  res.json(features);
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    const { id } = await dbApi.insertContact(name, email, subject, message);
    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

app.get('/api/contact/messages', async (req, res) => {
  try {
    const rows = await dbApi.listContacts(50);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (process.env.MYSQL_HOST) {
      console.log('Using MySQL database');
    } else {
      console.log('Using SQLite database');
    }
  });
})();

async function initDb() {
  const useMySql = !!process.env.MYSQL_HOST;
  if (useMySql) {
    const pool = await mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    await pool.query(
      'CREATE TABLE IF NOT EXISTS contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, subject VARCHAR(255) NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
    );
    dbApi = {
      async insertContact(name, email, subject, message) {
        const [result] = await pool.query(
          'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
          [name, email, subject, message]
        );
        return { id: result.insertId };
      },
      async listContacts(limit = 50) {
        const [rows] = await pool.query(
          'SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT ?',
          [limit]
        );
        return rows;
      }
    };
    return;
  }
  const sqlite = new Database(path.join(__dirname, 'data.sqlite'));
  sqlite.exec(
    'CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
  );
  dbApi = {
    async insertContact(name, email, subject, message) {
      const info = sqlite
        .prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
        .run(name, email, subject, message);
      return { id: info.lastInsertRowid };
    },
    async listContacts(limit = 50) {
      const rows = sqlite
        .prepare(
          'SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT ?'
        )
        .all(limit);
      return rows;
    }
  };
}
