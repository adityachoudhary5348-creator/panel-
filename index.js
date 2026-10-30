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

// Root URL redirect to Admin page
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Admin Panel & Key Generator with Key List View
app.get('/admin', (req, res) => {
  const keys = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  
  let keysHtml = keys.map(k => `<li style="padding: 5px; border-bottom: 1px solid #333;"><code>${k.key_code}</code> &nbsp; [<span style="color: #4CAF50;">${k.status}</span>]</li>`).join('');

  res.send(`
    <html>
      <head>
        <title>Drake Panel Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial; background: #121212; color: #fff; text-align: center; padding: 20px;">
        <h2>Drake Panel Key Generator</h2>
        <form action="/admin/generate" method="POST">
          <button type="submit" style="padding: 12px 25px; background: #6200ee; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">Generate 50 Phantom Keys</button>
        </form>
        
        <h3 style="margin-top: 30px;">Generated Keys (${keys.length}):</h3>
        <div style="max-width: 400px; margin: 0 auto; max-height: 350px; overflow-y: auto; background: #1e1e1e; border: 1px solid #333; border-radius: 5px; text-align: left; padding: 10px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${keysHtml || '<li style="color: #888; text-align: center;">No keys generated yet. Click the button above!</li>'}
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Generate Keys Route (Redirects back to admin page to show keys instantly)
app.post('/admin/generate', (req, res) => {
  const insert = db.prepare('INSERT OR IGNORE INTO keys (key_code, status) VALUES (?, ?)');
  
  for (let i = 1; i <= 50; i++) {
    const randomCode = `DRKE-${Math.floor(1000 + Math.random() * 9000)}-S0FF-N${Math.floor(1000 + Math.random() * 9000)}`;
    insert.run(randomCode, 'active');
  }
  
  res.redirect('/admin');
});

// Subscription Route for Happ Proxy App
app.get('/sub/:key', (req, res) => {
  const { key } = req.params;
  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);
  
  if (!keyRow || keyRow.status !== 'active') {
    return res.status(403).send('Invalid or expired key');
  }

  const directConfig = `vless://drake-${key}@panel-1-i3ow.onrender.com:443?encryption=none&security=none&type=tcp#Drake-Key-${key}`;
  
  const encodedConfig = Buffer.from(directConfig).toString('base64');
  res.send(encodedConfig);
});

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
