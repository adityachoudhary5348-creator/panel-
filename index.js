const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('drake.db');

// Database Tables Setup
db.exec(`
  CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_code TEXT UNIQUE,
    duration_days INTEGER,
    activated_date TEXT,
    expiry_date TEXT,
    device_info TEXT,
    device_id TEXT,
    status TEXT DEFAULT 'unused'
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
`);

// Default Admin create karein (Username: admin, Password: admin123)
const adminCheck = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
if (!adminCheck) {
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', 'admin123');
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'drake-secret-key-99',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// --- FRONTEND HTML (Drake Theme) ---
const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drake Panel</title>
    <style>
        :root {
            --bg-color: #0c0c0c;
            --card-bg: #141414;
            --border-color: #262626;
            --text-main: #ffffff;
            --text-muted: #888888;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: monospace, sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .phone-frame { width: 100%; max-width: 420px; height: 100vh; max-height: 850px; background: var(--bg-color); border: 2px solid var(--border-color); display: flex; flex-direction: column; position: relative; overflow-y: auto; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
        .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--border-color); }
        .top-bar h1 { font-size: 18px; letter-spacing: 2px; }
        .top-actions { display: flex; gap: 10px; }
        .icon-btn { background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); padding: 6px 12px; font-size: 12px; cursor: pointer; border-radius: 4px; text-decoration: none; }
        .content { flex: 1; padding: 20px; padding-bottom: 80px; }
        .screen { display: none; }
        .screen.active { display: block; }
        .login-container { text-align: center; margin-top: 20px; }
        .skull-logo { width: 100px; margin-bottom: 15px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
        .login-container h2 { font-size: 22px; letter-spacing: 3px; margin-bottom: 5px; }
        .login-container p { font-size: 10px; color: var(--text-muted); margin-bottom: 25px; letter-spacing: 1px; }
        .input-group { text-align: left; background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 15px; }
        .input-group label { display: block; font-size: 10px; color: var(--text-muted); margin-bottom: 5px; letter-spacing: 1px; }
        .input-row { display: flex; justify-content: space-between; align-items: center; }
        .input-row input { background: transparent; border: none; color: var(--text-main); font-size: 13px; outline: none; width: 70%; letter-spacing: 1px; }
        .action-btn { width: 100%; background: var(--text-main); color: var(--bg-color); border: none; padding: 14px; font-weight: bold; font-size: 13px; letter-spacing: 2px; cursor: pointer; margin-top: 10px; }
        .status-bar { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
        .timer-circle { text-align: center; position: relative; margin: 15px 0; }
        .time-display { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 22px; font-weight: bold; letter-spacing: 2px; }
        .time-label { font-size: 9px; color: var(--text-muted); letter-spacing: 2px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px; }
        .info-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 10px; text-align: center;
// --- ADMIN PANEL HTML (Drake Generator) ---
const adminPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Drake</title>
    <style>
        body { background: #0c0c0c; color: #fff; font-family: monospace; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #262626; padding: 20px; }
        h2 { margin-bottom: 20px; font-size: 18px; letter-spacing: 2px; }
        input, select { background: #0c0c0c; border: 1px solid #333; color: #fff; padding: 10px; width: 100%; margin-bottom: 15px; }
        button { background: #fff; color: #000; border: none; padding: 12px; font-weight: bold; width: 100%; cursor: pointer; }
        table { width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #262626; padding: 8px; text-align: left; }
        th { background: #1a1a1a; }
        .back-link { display: inline-block; margin-bottom: 15px; color: #888; text-decoration: none; font-size: 11px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Panel</a>
        <h2>DRAKE ADMIN KEY GENERATOR</h2>
        
        <form action="/admin/generate" method="POST">
            <label>Number of Days Validity:</label>
            <input type="number" name="days" value="3" required>
            
            <label>Count:</label>
            <input type="number" name="count" value="1" min="1" max="50" required>
            
            <button type="submit">GENERATE KEYS</button>
        </form>

        <h3 style="margin-top:25px; font-size:14px;">Existing Keys Database</h3>
        <table>
            <tr>
                <th>Key</th>
                <th>Days</th>
                <th>Status</th>
                <th>Device</th>
            </tr>
            {{KEY_LIST}}
        </table>
    </div>
</body>
</html>
`;

// --- ROUTES ---

app.get('/', (req, res) => {
  res.send(htmlPage);
});

app.post('/api/verify', (req, res) => {
  const { key, deviceInfo } = req.body;
  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);

  if (!keyRow) {
    return res.json({ success: false, message: 'Invalid access key!' });
  }

  const now = new Date();
  let activated = keyRow.activated_date;
  let expires = keyRow.expiry_date;

  if (keyRow.status === 'unused') {
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + keyRow.duration_days);

    activated = now.toISOString().split('T')[0];
    expires = expiryDate.toISOString().split('T')[0];

    db.prepare(`
      UPDATE keys SET status = 'active', activated_date = ?, expiry_date = ?, device_info = ? WHERE key_code = ?
    `).run(activated, expires, deviceInfo, key);
  } else {
    if (new Date(expires) < now) {
      return res.json({ success: false, message: 'Key has expired!' });
    }
  }

  res.json({
    success: true,
    key: keyRow.key_code,
    activated: activated,
    expires: expires,
    device: keyRow.device_info || deviceInfo,
    timeLeft: `${keyRow.duration_days}D 00H`
  });
});

app.post('/api/reset-device', (req, res) => {
  const { key } = req.body;
  db.prepare('UPDATE keys SET status = "unused", activated_date = NULL, expiry_date = NULL, device_info = NULL WHERE key_code = ?').run(key);
  res.json({ success: true });
});

app.get('/admin', (req, res) => {
  if (!req.session.isAdmin) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Admin Login</title><style>body{background:#0c0c0c;color:#fff;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;} .box{background:#141414;padding:20px;border:1px solid #262626;width:300px;} input{width:100%;padding:10px;margin-bottom:10px;background:#0c0c0c;border:1px solid #333;color:#fff;} button{width:100%;padding:10px;background:#fff;border:none;font-weight:bold;cursor:pointer;}</style></head>
      <body>
        <div class="box">
          <h2>DRAKE ADMIN LOGIN</h2>
          <form method="POST" action="/admin/login">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">LOGIN</button>
          </form>
        </div>
      </body>
      </html>
    `);
  }

  const keys = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  let rowsHtml = keys.map(k => `
    <tr>
      <td>${k.key_code}</td>
      <td>${k.duration_days} Days</td>
      <td>${k.status}</td>
      <td>${k.device_info || 'Not locked'}</td>
    </tr>
  `).join('');

  res.send(adminPage.replace('{{KEY_LIST}}', rowsHtml));
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE username = ? AND password = ?').get(username, password);
  if (admin) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.send('<script>alert("Invalid credentials!"); window.location.href="/admin";</script>');
  }
});

app.post('/admin/generate', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/admin');
  const { days, count } = req.body;

  const insert = db.prepare('INSERT INTO keys (key_code, duration_days) VALUES (?, ?)');
  
  for (let i = 0; i < count; i++) {
    const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const r3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const keyString = `DRKE-${r1}-${r2}-${r3}`;
    
    try {
      insert.run(keyString, parseInt(days));
    } catch (err) {}
  }

  res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Drake server running on port ' + PORT);
});
