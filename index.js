const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('drake.db');

// Database Tables Creation
db.exec(`
  CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_code TEXT UNIQUE,
    duration_value REAL,
    duration_type TEXT,
    activated_date TEXT,
    expiry_date TEXT,
    device_info TEXT,
    status TEXT DEFAULT 'unused'
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
`);

// Default Admin Account Creation
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
const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drake Panel - Free Fire</title>
    <style>
        :root {
            --bg-color: #0c0c0c;
            --card-bg: #141414;
            --border-color: #262626;
            --text-main: #ffffff;
            --text-muted: #888888;
            --accent-red: #ff5252;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: monospace, sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .phone-frame { width: 100%; max-width: 420px; height: 100vh; max-height: 850px; background: var(--bg-color); border: 2px solid var(--border-color); display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
        .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
        .top-bar h1 { font-size: 16px; letter-spacing: 2px; }
        .top-actions { display: flex; gap: 8px; align-items: center; }
        .icon-btn { background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-main); padding: 5px 10px; font-size: 11px; cursor: pointer; border-radius: 4px; text-decoration: none; }
        .content { flex: 1; padding: 15px; padding-bottom: 100px; overflow-y: scroll; -webkit-overflow-scrolling: touch; }
        .screen { display: none; }
        .screen.active { display: block; }
        .login-container { text-align: center; margin-top: 20px; }
        .login-container h2 { font-size: 24px; letter-spacing: 3px; margin-bottom: 5px; }
        .login-container p { font-size: 9px; color: var(--text-muted); margin-bottom: 25px; letter-spacing: 1px; }
        .input-group { text-align: left; background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 15px; }
        .input-group label { display: block; font-size: 9px; color: var(--text-muted); margin-bottom: 5px; letter-spacing: 1px; }
        .input-row { display: flex; justify-content: space-between; align-items: center; }
        .input-row input { background: transparent; border: none; color: var(--text-main); font-size: 13px; outline: none; width: 70%; letter-spacing: 1px; }
        .action-btn { width: 100%; background: var(--text-main); color: var(--bg-color); border: none; padding: 14px; font-weight: bold; font-size: 13px; letter-spacing: 2px; cursor: pointer; margin-top: 10px; }
        .status-row { display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 1px; }
        .timer-section { text-align: center; position: relative; margin: 10px 0 20px 0; }
        .time-left-val { font-size: 26px; font-weight: bold; letter-spacing: 2px; margin-bottom: 2px; }
        .time-left-label { font-size: 9px; color: var(--text-muted); letter-spacing: 2px; }
        .key-box { background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .key-box span { font-size: 11px; letter-spacing: 1px; word-break: break-all; }
        .copy-btn { background: #1f1f1f; border: 1px solid var(--border-color); color: #fff; padding: 6px 10px; font-size: 10px; cursor: pointer; letter-spacing: 1px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .info-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 10px 6px; text-align: center; }
        .info-card span { display: block; font-size: 8px; color: var(--text-muted); margin-bottom: 4px; letter-spacing: 0.5px; }
        .info-card strong { font-size: 9px; word-break: break-word; }
        .features-top-note { display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted); margin-bottom: 12px; letter-spacing: 0.5px; }
        .feature-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 12px; position: relative; }
        .feature-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .feature-title { font-size: 11px; font-weight: bold; letter-spacing: 1px; color: #fff; }
        .feature-desc { font-size: 8px; color: var(--text-muted); margin-bottom: 10px; line-height: 1.4; }
        .switch { position: relative; display: inline-block; width: 36px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider-switch { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #222; border: 1px solid #444; transition: .3s; }
        .slider-switch:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .3s; }
        input:checked + .slider-switch { background-color: #fff; }
        input:checked + .slider-switch:before { transform: translateX(16px); background-color: #000; }
        .nav-bar { position: absolute; bottom: 0; left: 0; width: 100%; background: #0f0f0f; border-top: 1px solid var(--border-color); display: flex; justify-content: space-around; padding: 10px 0; z-index: 10; }
        .nav-item { background: none; border: none; color: var(--text-muted); font-size: 9px; text-align: center; cursor: pointer; letter-spacing: 1px; }
        .nav-item.active { color: var(--text-main); }
        .nav-item div { font-size: 16px; margin-bottom: 2px; }
        .error-msg { color: #ff5252; font-size: 10px; margin-top: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="phone-frame">
        <div class="top-bar">
            <h1 id="page-title">DRAKE</h1>
            <div class="top-actions"><button class="icon-btn">EN</button></div>
        </div>

        <div class="content">
            <div id="login-screen" class="screen active">
                <div class="login-container">
                    <h2>DRAKE PANEL</h2>
                    <p>FREE FIRE LICENSE SYSTEM</p>
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="input-group">
                            <label>■ ACCESS KEY</label>
                            <div class="input-row">
                                <input type="text" id="key-input" name="key" placeholder="DRKE-XXXX-XXXX-XXXX" required>
                                <button type="button" class="icon-btn" onclick="pasteKey()">PASTE</button>
                            </div>
                        </div>
                        <button type="submit" class="action-btn">UNLOCK PANEL</button>
                        <div id="login-error" class="error-msg"></div>
                    </form>
                </div>
            </div>

            <div id="home-screen" class="screen">
                <div class="status-row">
                    <span style="color:#4caf50;">■ ONLINE</span>
                    <span>FF PANEL CONNECTED</span>
                </div>
                <div class="timer-section">
                    <div class="time-left-val" id="time-left-display">--</div>
                    <div class="time-left-label">TIME LEFT</div>
                </div>
                <div class="key-box">
                    <span id="display-key">-</span>
                    <button class="copy-btn" onclick="copyKeyText()">COPY</button>
                </div>
                <div class="info-grid">
                    <div class="info-card"><span>ACTIVATED</span><strong id="info-activated">-</strong></div>
                    <div class="info-card"><span>EXPIRES</span><strong id="info-expires">-</strong></div>
                    <div class="info-card"><span>DEVICE</span><strong id="info-device">-</strong></div>
                </div>
            </div>

            <div id="features-screen" class="screen">
                <div class="features-top-note">
                    <span>Free Fire Mod Controls</span>
                    <span style="color:#fff; font-weight:bold;">ACTIVE</span>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">01 ENEMY ESP / MARKER</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">Marks every enemy on screen in real-time.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">02 AIMBOT (HEAD)</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">Locks crosshair toward enemy head automatically.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">03 GLOO WALL ROTATION</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">Instantly rotates gloo wall to 180 degrees.</div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">04 FAST REVIVE</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">Revives teammates in 0.1s instead of 3s.</div>
                </div>
            </div>

            <div id="manage-screen" class="screen">
                <div class="feature-card" style="margin-bottom:15px;">
                    <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">CONNECTED DEVICE</div>
                    <div id="manage-device-name" style="font-size:13px; font-weight:bold; margin:4px 0;">-</div>
                    <button class="action-btn" onclick="resetDevice()" style="background:#1a1a1a; color:#fff; border:1px solid #333; padding:10px; margin-top:8px; font-size:11px;">RESET DEVICE LOCK</button>
                </div>
                <button class="action-btn" onclick="logout()" style="background:#3a1515; color:#ff6b6b; border:1px solid #522; font-size:12px; padding:12px;">LOG OUT</button>
            </div>
        </div>

        <div class="nav-bar" id="bottom-nav" style="display:none;">
            <button class="nav-item active" onclick="switchTab('home', this)"><div>🏠</div>HOME</button>
            <button class="nav-item" onclick="switchTab('features', this)"><div>🎛️</div>FEATURES</button>
            <button class="nav-item" onclick="switchTab('manage', this)"><div>⚙️</div>MANAGE</button>
        </div>
    </div>
    <script>
        let currentKey = "";
        let expiryTimeMs = 0;
        let timerInterval = null;

        function pasteKey() {
            navigator.clipboard.readText().then(text => {
                document.getElementById('key-input').value = text.trim();
            }).catch(err => { alert("Please paste manually."); });
        }

        function copyKeyText() {
            navigator.clipboard.writeText(currentKey);
            alert("Key copied!");
        }

        async function handleLogin(e) {
            e.preventDefault();
            const key = document.getElementById('key-input').value.trim();
            const deviceInfo = navigator.userAgent;
            
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, deviceInfo })
            });
            const data = await res.json();

            if(data.success) {
                currentKey = key;
                expiryTimeMs = new Date(data.rawExpiry).getTime();
                
                document.getElementById('display-key').innerText = data.key;
                document.getElementById('info-activated').innerText = data.activated || '-';
                document.getElementById('info-expires').innerText = data.expires || '-';
                document.getElementById('info-device').innerText = data.device || 'Android';
                document.getElementById('manage-device-name').innerText = data.device || 'Android';
                
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById('home-screen').classList.add('active');
                document.getElementById('bottom-nav').style.display = 'flex';
                document.getElementById('page-title').innerText = "HOME";

                startCountdown();
            } else {
                document.getElementById('login-error').innerText = data.message;
            }
        }

        function startCountdown() {
            if(timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = expiryTimeMs - now;

                if (distance < 0) {
                    document.getElementById('time-left-display').innerText = "EXPIRED";
                    clearInterval(timerInterval);
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                let timeStr = days > 0 ? \`\${days}D \${hours}H\` : \`\${hours}H \${minutes}M \${seconds}S\`;
                document.getElementById('time-left-display').innerText = timeStr;
            }, 1000);
        }

        function switchTab(tabName, element) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            if(tabName === 'home') document.getElementById('home-screen').classList.add('active');
            else if(tabName === 'features') document.getElementById('features-screen').classList.add('active');
            else if(tabName === 'manage') document.getElementById('manage-screen').classList.add('active');
            document.getElementById('page-title').innerText = tabName.toUpperCase();
            element.classList.add('active');
        }

        async function resetDevice() {
            const res = await fetch('/api/reset-device', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: currentKey })
            });
            const data = await res.json();
            if(data.success) { alert("Device reset successfully!"); logout(); }
        }

        function logout() {
            if(timerInterval) clearInterval(timerInterval);
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('login-screen').classList.add('active');
            document.getElementById('bottom-nav').style.display = 'none';
            document.getElementById('page-title').innerText = "DRAKE";
            document.getElementById('key-input').value = "";
            currentKey = "";
        }
    </script>
</body>
</html>`;
const adminPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Drake Panel</title>
    <style>
        body { background: #0c0c0c; color: #fff; font-family: monospace; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #141414; border: 1px solid #262626; padding: 20px; }
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
        <a href="/" class="back-link">← Back to User Panel</a>
        <h2>DRAKE ADMIN - FREE FIRE KEYS</h2>
        <form action="/admin/generate" method="POST">
            <label>Duration Value:</label>
            <input type="number" step="0.1" name="duration" value="24" required>
            
            <label>Duration Type:</label>
            <select name="type">
                <option value="hours" selected>Hours</option>
                <option value="days">Days</option>
            </select>
            
            <label>Generate Count:</label>
            <input type="number" name="count" value="1" min="1" max="50" required>
            
            <button type="submit">GENERATE KEYS</button>
        </form>
        <h3 style="margin-top:25px; font-size:14px;">Existing Database Keys</h3>
        <table>
            <tr><th>Key Code</th><th>Duration</th><th>Status</th><th>Device Lock</th></tr>
            {{KEY_LIST}}
        </table>
    </div>
</body>
</html>`;

app.get('/', (req, res) => { res.send(htmlPage); });

app.post('/api/verify', (req, res) => {
  const { key, deviceInfo } = req.body;
  if (!key) {
    return res.json({ success: false, message: 'Access key is missing!' });
  }

  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);
  if (!keyRow) { 
    return res.json({ success: false, message: 'Invalid access key!' }); 
  }

  const now = new Date();
  let activated = keyRow.activated_date;
  let expires = keyRow.expiry_date;

  if (keyRow.status === 'active') {
    if (keyRow.device_info && keyRow.device_info !== deviceInfo) {
      return res.json({ success: false, message: 'Key is already locked to another device!' });
    }
    if (new Date(expires) < now) { 
      return res.json({ success: false, message: 'Key has expired!' }); 
    }
  } 
  else if (keyRow.status === 'unused') {
    const expiryDate = new Date();
    if (keyRow.duration_type === 'hours') {
      expiryDate.setTime(now.getTime() + (keyRow.duration_value * 60 * 60 * 1000));
    } else {
      expiryDate.setDate(now.getDate() + parseInt(keyRow.duration_value));
    }

    activated = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    expires = expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    db.prepare(`
      UPDATE keys 
      SET status = 'active', activated_date = ?, expiry_date = ?, device_info = ? 
      WHERE key_code = ?
    `).run(activated, expires, deviceInfo || 'FreeFire-Android', key);
  }

  const updatedRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);

  let rawExpiryDate = new Date();
  if (updatedRow.duration_type === 'hours') {
    rawExpiryDate = new Date(now.getTime() + (updatedRow.duration_value * 60 * 60 * 1000));
  } else {
    rawExpiryDate = new Date(now.getTime() + (updatedRow.duration_value * 24 * 60 * 60 * 1000));
  }

  res.json({
    success: true,
    message: 'Login Successful!',
    key: updatedRow.key_code,
    activated: updatedRow.activated_date,
    expires: updatedRow.expiry_date,
    device: updatedRow.device_info || deviceInfo,
    rawExpiry: rawExpiryDate.toISOString()
  });
});

app.post('/api/reset-device', (req, res) => {
  const { key } = req.body;
  db.prepare('UPDATE keys SET status = "unused", activated_date = NULL, expiry_date = NULL, device_info = NULL WHERE key_code = ?').run(key);
  res.json({ success: true });
});

app.get('/admin', (req, res) => {
  if (!req.session.isAdmin) {
    return res.send(`<!DOCTYPE html><html><head><title>Admin Login</title><style>body{background:#0c0c0c;color:#fff;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;} .box{background:#141414;padding:20px;border:1px solid #262626;width:300px;} input{width:100%;padding:10px;margin-bottom:10px;background:#0c0c0c;border:1px solid #333;color:#fff;} button{width:100%;padding:10px;background:#fff;border:none;font-weight:bold;cursor:pointer;}</style></head><body><div class="box"><h2>DRAKE ADMIN LOGIN</h2><form method="POST" action="/admin/login"><input type="text" name="username" placeholder="Username" required><input type="password" name="password" placeholder="Password" required><button type="submit">LOGIN</button></form></div></body></html>`);
  }
  const keys = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  let rowsHtml = keys.map(k => `<tr><td>${k.key_code}</td><td>${k.duration_value} ${k.duration_type}</td><td>${k.status}</td><td>${k.device_info || 'Not locked'}</td></tr>`).join('');
  res.send(adminPage.replace('{{KEY_LIST}}', rowsHtml));
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.send('<script>alert("Invalid credentials!"); window.location.href="/admin";</script>');
  }
});

app.post('/admin/generate', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/admin');
  const { duration, type, count } = req.body;
  const insert = db.prepare('INSERT INTO keys (key_code, duration_value, duration_type) VALUES (?, ?, ?)');
  for (let i = 0; i < count; i++) {
    const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const r3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const keyString = `DRKE-${r1}-${r2}-${r3}`;
    try { insert.run(keyString, parseFloat(duration), type); } catch (err) {}
  }
  res.redirect('/admin');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log('Drake server running on port ' + PORT); });
