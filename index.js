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
  secret: 'drake_secure_session_key_999',
  resave: false,
  saveUninitialized: true
}));

// Database Setup
try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key_code TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      device TEXT DEFAULT 'Tecno Spark Go',
      platform TEXT DEFAULT 'Android',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
} catch (err) {
  console.error("DB Setup Error:", err);
}

// Device detection helper
const getDeviceInfo = (userAgent) => {
  if (/tecno/i.test(userAgent)) return { name: 'Tecno Spark Go', os: 'Android' };
  if (/android/i.test(userAgent)) return { name: 'Android Device', os: 'Android' };
  if (/iphone|ipad|ipod/i.test(userAgent)) return { name: 'iPhone 11 Pro Max', os: 'iOS' };
  if (/windows/i.test(userAgent)) return { name: 'Windows PC', os: 'Windows' };
  return { name: 'Tecno Spark Go', os: 'Android' };
};

// Middlewares
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userKey) {
    return res.redirect('/login');
  }
  const keyCheck = db.prepare("SELECT * FROM keys WHERE key_code = ? AND status = 'active'").get(req.session.userKey);
  if (!keyCheck) {
    req.session.destroy();
    return res.redirect('/login');
  }
  next();
};

const isAdminAuthenticated = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel Required"');
    return res.status(401).send('Authentication required.');
  }
  const auth = Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
  if (auth[0] === 'drake' && auth[1] === 'admin999') {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel Required"');
    return res.status(401).send('Invalid Login Credentials!');
  }
};
app.get('/', (req, res) => {
  res.redirect('/login');
});

// 1. Login Page
app.get('/login', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>DRAKE PANEL</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #0b0b0b; color: #fff; font-family: sans-serif; text-align: center; padding: 40px 20px; margin: 0; }
          h2 { letter-spacing: 2px; font-size: 24px; margin-bottom: 5px; }
          p { color: #888; font-size: 13px; margin-bottom: 30px; }
          .box { background: #141414; border: 1px solid #222; padding: 25px; max-width: 350px; margin: 0 auto; border-radius: 8px; }
          input { width: 100%; padding: 12px; background: #1a1a1a; border: 1px solid #333; color: #fff; border-radius: 4px; box-sizing: border-box; font-size: 14px; margin-bottom: 15px; text-transform: uppercase; }
          button { width: 100%; padding: 12px; background: #fff; color: #000; border: none; font-weight: bold; border-radius: 4px; cursor: pointer; font-size: 15px; }
          .footer-text { color: #666; font-size: 11px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>DRAKE</h2>
          <p>NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</p>
          <form action="/login" method="POST">
            <input type="text" name="key" placeholder="DRKE-XXXX-XXXX-XXXX" required autocomplete="off">
            <button type="submit">UNLOCK</button>
          </form>
          <div class="footer-text">no key? contact your seller.<br>your time starts when you connect.</div>
        </div>
      </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const userKey = req.body.key ? req.body.key.trim() : '';
  const keyRow = db.prepare("SELECT * FROM keys WHERE key_code = ? AND status = 'active'").get(userKey);
  
  if (keyRow) {
    const ua = req.headers['user-agent'] || '';
    const dev = getDeviceInfo(ua);
    db.prepare("UPDATE keys SET device = ?, platform = ? WHERE key_code = ?").run(dev.name, dev.os, userKey);

    req.session.userKey = keyRow.key_code;
    res.redirect('/home');
  } else {
    res.send("<script>alert('Invalid or Unauthorized Key!'); window.location='/login';</script>");
  }
});

// 2. Home Dashboard
app.get('/home', isAuthenticated, (req, res) => {
  const key = req.session.userKey;
  const keyData = db.prepare("SELECT * FROM keys WHERE key_code = ?").get(key);
  const deviceName = keyData ? keyData.device : 'Tecno Spark Go';

  res.send(`
    <html>
      <head>
        <title>DRAKE PANEL</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #0b0b0b; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 70px; }
          .header { display: flex; justify-content: space-between; padding: 15px 20px; background: #111; border-bottom: 1px solid #222; font-weight: bold; font-size: 14px; }
          .container { padding: 20px; text-align: center; }
          .timer-box { font-size: 32px; font-weight: bold; margin: 20px 0 5px 0; letter-spacing: 1px; }
          .sub-label { color: #777; font-size: 12px; margin-bottom: 25px; }
          .key-card { background: #141414; border: 1px solid #222; padding: 12px 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .info-card { background: #141414; border: 1px solid #222; padding: 12px; border-radius: 6px; text-align: left; }
          .info-card span { display: block; color: #666; font-size: 10px; margin-bottom: 4px; text-transform: uppercase; }
          .info-card b { font-size: 11px; word-break: break-all; }
          .nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #111; border-top: 1px solid #222; display: flex; justify-content: space-around; padding: 10px 0; z-index: 100; }
          .nav a { color: #777; text-decoration: none; font-size: 11px; text-align: center; text-transform: uppercase; }
          .nav a.active { color: #fff; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><span>DRAKE BY NULLDASH</span><span>EN</span></div>
        <div class="container">
          <div style="color: #666; font-size: 11px; text-align: left; margin-bottom: 10px;">● OFFLINE &nbsp;&nbsp;&nbsp; LAST REFRESHED JUST NOW</div>
          <div class="timer-box">2H 11M</div>
          <div class="sub-label">TIME LEFT</div>
          
          <div class="key-card">
            <span style="font-size: 13px; color: #aaa;">KEY: <strong style="color:#fff;">${key}</strong></span>
            <button onclick="navigator.clipboard.writeText('${key}')" style="background:#222; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:11px; cursor:pointer;">COPY</button>
          </div>

          <div class="info-grid">
            <div class="info-card"><span>ACTIVATED</span><b>29 Oct 2026</b></div>
            <div class="info-card"><span>EXPIRES</span><b>30 Oct 2026</b></div>
            <div class="info-card"><span>DEVICE</span><b>${deviceName}</b></div>
          </div>
        </div>

        <div class="nav">
          <a href="/home" class="active">🏠<br>Home</a>
          <a href="/features">⚙️<br>Features</a>
          <a href="/manage">📁<br>Manage</a>
        </div>
      </body>
    </html>
  `);
});
// 3. Features Dashboard
app.get('/features', isAuthenticated, (req, res) => {
  res.send(`
    <html>
      <head>
        <title>DRAKE FEATURES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #0b0b0b; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 80px; }
          .header { padding: 15px 20px; background: #111; border-bottom: 1px solid #222; font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; }
          .container { padding: 15px; }
          .section { background: #141414; border: 1px solid #222; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
          .sec-title { font-size: 13px; font-weight: bold; margin-bottom: 5px; }
          .sec-desc { color: #777; font-size: 11px; margin-bottom: 12px; }
          .tag-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
          .tag { background: #1a1a1a; border: 1px solid #333; padding: 8px 2px; text-align: center; font-size: 9px; border-radius: 4px; color: #aaa; }
          .tag.active { background: #fff; color: #000; font-weight: bold; border-color: #fff; }
          .sub-option { display: flex; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 10px; border-radius: 4px; margin-top: 8px; font-size: 11px; color: #aaa; }
          .nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #111; border-top: 1px solid #222; display: flex; justify-content: space-around; padding: 10px 0; z-index: 100; }
          .nav a { color: #777; text-decoration: none; font-size: 11px; text-align: center; text-transform: uppercase; }
          .nav a.active { color: #fff; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><span>FEATURES</span><span>5/5</span></div>
        <div class="container">
          <div style="color: #777; font-size: 11px; margin-bottom: 12px;">changes apply from your next match</div>
          
          <div class="section">
            <div class="sec-title">01 MARKER</div>
            <div class="sec-desc">marks every enemy on your screen.</div>
            <div class="tag-grid">
              <div class="tag active">DRAKE</div>
              <div class="tag">DREAM</div>
              <div class="tag">ICE WALL</div>
              <div class="tag">MOCO</div>
              <div class="tag">CLU</div>
              <div class="tag">SHIROU</div>
              <div class="tag">IRIS</div>
              <div class="tag">DREKI</div>
            </div>
          </div>

          <div class="section">
            <div class="sec-title">02 AIMPOINT <span style="font-size:9px; background:#222; padding:2px 5px; border-radius:3px; color:#aaa;">NEW</span></div>
            <div class="sec-desc">moves your aim from the chest toward the head.</div>
            <div style="text-align: right; font-size: 20px; font-weight: bold; color: #ff4d4d;">100%</div>
          </div>

          <div class="section">
            <div class="sec-title">03 AIM LAG</div>
            <div class="sec-desc">freezes the enemy for a moment while you fire or scope.</div>
            <div class="sub-option"><span>when firing</span> <input type="checkbox" checked></div>
            <div class="sub-option"><span>when scoping</span> <input type="checkbox" checked></div>
          </div>

          <div class="section">
            <div class="sec-title">04 GLOO WALL ROTATION</div>
            <div class="sec-desc">turns your gloo wall to the angle you set.</div>
            <div style="text-align: right; font-size: 18px; font-weight: bold; color: #fff;">180°</div>
          </div>

          <div class="section">
            <div class="sec-title">05 FAST REVIVE</div>
            <div class="sec-desc">picks up a knocked teammate in about 0.1 s instead of 3 s.</div>
          </div>
        </div>

        <div class="nav">
          <a href="/home">🏠<br>Home</a>
          <a href="/features" class="active">⚙️<br>Features</a>
          <a href="/manage">📁<br>Manage</a>
        </div>
      </body>
    </html>
  `);
});

// 4. Manage Dashboard
app.get('/manage', isAuthenticated, (req, res) => {
  const key = req.session.userKey;
  const keyData = db.prepare("SELECT * FROM keys WHERE key_code = ?").get(key);
  const deviceName = keyData ? keyData.device : 'Tecno Spark Go';
  const platformName = keyData ? keyData.platform : 'Android';

  res.send(`
    <html>
      <head>
        <title>DRAKE MANAGE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #0b0b0b; color: #fff; font-family: sans-serif; margin: 0; padding-bottom: 70px; }
          .header { padding: 15px 20px; background: #111; border-bottom: 1px solid #222; font-weight: bold; font-size: 14px; }
          .container { padding: 15px; }
          .card { background: #141414; border: 1px solid #222; padding: 15px; border-radius: 6px; margin-bottom: 12px; }
          .nav { position: fixed; bottom: 0; left: 0; width: 100%; background: #111; border-top: 1px solid #222; display: flex; justify-content: space-around; padding: 10px 0; z-index: 100; }
          .nav a { color: #777; text-decoration: none; font-size: 11px; text-align: center; text-transform: uppercase; }
          .nav a.active { color: #fff; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">MANAGE</div>
        <div class="container">
          <div class="card">
            <span style="font-size:10px; color:#666;">THIS DEVICE</span>
            <h3 style="margin:5px 0; font-size:16px; text-transform:uppercase;">${deviceName}</h3>
            <span style="font-size:11px; color:#888;">${platformName}</span>
          </div>
        </div>
        <div class="nav">
          <a href="/home">🏠<br>Home</a>
          <a href="/features">⚙️<br>Features</a>
          <a href="/manage" class="active">📁<br>Manage</a>
        </div>
      </body>
    </html>
  `);
});

// 5. Secret Admin Key Generator Panel (Username: drake, Password: admin999)
app.get('/drake-secret-admin-panel-999', isAdminAuthenticated, (req, res) => {
  let keys = [];
  try {
    keys = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  } catch(e) {}

  let listHtml = keys.map(k => `<li style="padding:6px; border-bottom:1px solid #222; display:flex; justify-content:space-between; font-size:12px;"><code>${k.key_code}</code> <span style="color:#aaa;">${k.device}</span> <span style="color:#4CAF50;">${k.status}</span></li>`).join('');

  res.send(`
    <html>
      <head><title>Admin Key Generator</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="background:#0b0b0b; color:#fff; font-family:sans-serif; padding:20px; text-align:center;">
        <h2>Drake Admin Key Control</h2>
        <form action="/drake-secret-admin-panel-999/generate" method="POST">
          <button style="padding:12px 25px; background:#fff; color:#000; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Generate 50 Valid Keys</button>
        </form>
        <div style="max-width:500px; margin:20px auto; text-align:left; background:#141414; padding:15px; border-radius:6px; border:1px solid #222;">
          <ul style="list-style:none; padding:0; margin:0; max-height:300px; overflow-y:auto;">
            ${listHtml || '<li style="color:#666;">No keys found.</li>'}
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.post('/drake-secret-admin-panel-999/generate', isAdminAuthenticated, (req, res) => {
  try {
    const insert = db.prepare('INSERT OR IGNORE INTO keys (key_code, status, device) VALUES (?, ?, ?)');
    for (let i = 1; i <= 50; i++) {
      const code = `DRKE-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      insert.run(code, 'active', 'Tecno Spark Go');
    }
  } catch(e) {}
  res.redirect('/drake-secret-admin-panel-999');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
