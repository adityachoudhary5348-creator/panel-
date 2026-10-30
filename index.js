const express = require('express');
const Database = require('better-sqlite3');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'drake_panel.db');
const db = new Database(dbPath);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'drake_secret_key_999',
  resave: false,
  saveUninitialized: true
}));

// Table Creation for Keys
try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_code TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
} catch (err) {
  console.error("DB Table Creation Error:", err);
}

// Root URL redirect to Admin page
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Admin Panel UI & Key List
app.get('/admin', (req, res) => {
  let keys = [];
  try {
    keys = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  } catch (err) {
    console.error(err);
  }
  
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

// Generate 50 Keys Logic
app.post('/admin/generate', (req, res) => {
  try {
    const insert = db.prepare('INSERT OR IGNORE INTO keys (key_code, status) VALUES (?, ?)');
    for (let i = 1; i <= 50; i++) {
      const randomCode = `DRKE-${Math.floor(1000 + Math.random() * 9000)}-S0FF-N${Math.floor(1000 + Math.random() * 9000)}`;
      insert.run(randomCode, 'active');
    }
  } catch (err) {
    console.error("Key Generation Error:", err);
  }
  res.redirect('/admin');
});

// Auto-Sub Route (Grabs latest active key and returns Base64 config for V2Box)
app.get('/sub', (req, res) => {
  try {
    const keyRow = db.prepare("SELECT * FROM keys WHERE status = 'active' ORDER BY id DESC LIMIT 1").get();
    const key = keyRow ? keyRow.key_code : 'DRKE-DEFAULT-9999';

    const directConfig = `vless://drake-${key}@panel-1-i3ow.onrender.com:443?encryption=none&security=tls&type=tcp#Drake-Key-${key}`;
    const encodedConfig = Buffer.from(directConfig).toString('base64');
    return res.send(encodedConfig);
  } catch (err) {
    const fallbackConfig = `vless://drake-fallback@panel-1-i3ow.onrender.com:443?encryption=none&security=tls&type=tcp#Drake-Fallback`;
    return res.send(Buffer.from(fallbackConfig).toString('base64'));
  }
});

// Server Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
