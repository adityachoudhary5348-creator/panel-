const express = require('express');
const Database = require('better-sqlite3');
const helmet = require('helmet');
const session = require('express-session');

const app = express();
const db = new Database('drake_panel.db');

// Security & Middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'drake_secret_key_999',
  resave: false,
  saveUninitialized: true
}));

// Database Table Creation
db.prepare(`
  CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_code TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Root URL redirect to Admin page (fixes Cannot GET / error)
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Admin Login Page
app.get('/admin', (req, res) => {
  res.send(`
    <html>
      <head><title>Drake Panel Admin</title></head>
      <body style="font-family: Arial; background: #121212; color: #fff; text-align: center; padding-top: 50px;">
        <h2>Drake Panel Key Generator</h2>
        <form action="/admin/generate" method="POST">
          <button type="submit" style="padding: 10px 20px; background: #6200ee; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Generate 50 Phantom Keys</button>
        </form>
      </body>
    </html>
  `);
});

// Generate Keys Route
app.post('/admin/generate', (req, res) => {
  const insert = db.prepare('INSERT OR IGNORE INTO keys (key_code, status) VALUES (?, ?)');
  
  for (let i = 1; i <= 50; i++) {
    const randomCode = `DRKE-${Math.floor(1000 + Math.random() * 9000)}-S0FF-N${Math.floor(1000 + Math.random() * 9000)}`;
    insert.run(randomCode, 'active');
  }
  
  res.send('<h3>50 Phantom Keys Generated Successfully!</h3><a href="/admin">Go Back</a>');
});

// Subscription Route for Happ Proxy App
app.get('/sub/:key', (req, res) => {
  const { key } = req.params;
  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);
  
  if (!keyRow || keyRow.status !== 'active') {
    return res.status(403).send('Invalid or expired key');
  }

  // Direct configuration format using your panel-1-i3ow.onrender.com domain
  const directConfig = `vless://drake-${key}@panel-1-i3ow.onrender.com:443?encryption=none&security=none&type=tcp#Drake-Key-${key}`;
  
  const encodedConfig = Buffer.from(directConfig).toString('base64');
  res.send(encodedConfig);
});

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
