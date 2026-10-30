const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('drake.db');

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
    <title>Drake Panel</title>
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
        .skull-logo { width: 110px; margin-bottom: 15px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
        .login-container h2 { font-size: 24px; letter-spacing: 3px; margin-bottom: 5px; }
        .login-container p { font-size: 9px; color: var(--text-muted); margin-bottom: 25px; letter-spacing: 1px; }
        .input-group { text-align: left; background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px; margin-bottom: 15px; }
        .input-group label { display: block; font-size: 9px; color: var(--text-muted); margin-bottom: 5px; letter-spacing: 1px; }
        .input-row { display: flex; justify-content: space-between; align-items: center; }
        .input-row input { background: transparent; border: none; color: var(--text-main); font-size: 13px; outline: none; width: 70%; letter-spacing: 1px; }
        .action-btn { width: 100%; background: var(--text-main); color: var(--bg-color); border: none; padding: 14px; font-weight: bold; font-size: 13px; letter-spacing: 2px; cursor: pointer; margin-top: 10px; clip-path: polygon(0 0, 96% 0, 100% 25%, 100% 100%, 4% 100%, 0 75%); }
        .status-row { display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 1px; }
        .timer-section { text-align: center; position: relative; margin: 10px 0 20px 0; }
        .timer-skull { width: 90px; margin-bottom: 10px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.4)); }
        .time-left-val { font-size: 26px; font-weight: bold; letter-spacing: 2px; margin-bottom: 2px; }
        .time-left-label { font-size: 9px; color: var(--text-muted); letter-spacing: 2px; }
        .key-box { background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .key-box span { font-size: 11px; letter-spacing: 1px; word-break: break-all; }
        .copy-btn { background: #1f1f1f; border: 1px solid var(--border-color); color: #fff; padding: 6px 10px; font-size: 10px; cursor: pointer; letter-spacing: 1px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        .info-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 10px 6px; text-align: center; }
        .info-card span { display: block; font-size: 8px; color: var(--text-muted); margin-bottom: 4px; letter-spacing: 0.5px; }
        .info-card strong { font-size: 9px; word-break: break-word; }
        .sub-box { background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; clip-path: polygon(0 0, 96% 0, 100% 30%, 100% 100%, 0 100%); margin-bottom: 15px; }
        .sub-box h3 { font-size: 11px; letter-spacing: 1px; margin-bottom: 2px; }
        .sub-box p { font-size: 8px; color: var(--text-muted); }
        .add-btn { background: #dcdcdc; border: none; color: #000; width: 32px; height: 32px; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; cursor: pointer; }
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
        .style-label { font-size: 8px; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 6px; display: block; }
        .style-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 5px; }
        .style-btn { background: #0c0c0c; border: 1px solid var(--border-color); color: var(--text-muted); font-size: 8px; padding: 8px 4px; text-align: center; cursor: pointer; letter-spacing: 0.5px; }
        .style-btn.active { background: #fff; color: #000; font-weight: bold; border-color: #fff; }
        .aim-slider-container { display: flex; gap: 15px; align-items: center; margin-top: 10px; }
        .body-preview { width: 70px; height: 90px; background: #0c0c0c; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; position: relative; }
        .slider-box { flex: 1; }
        .custom-range { width: 100%; accent-color: #fff; background: #333; height: 4px; outline: none; margin: 10px 0; }
        .range-labels { display: flex; justify-content: space-between; font-size: 7px; color: var(--text-muted); }
        .angle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 8px; }
        .angle-btn { background: #0c0c0c; border: 1px solid var(--border-color); color: var(--text-main); font-size: 9px; padding: 6px; text-align: center; cursor: pointer; }
        .angle-btn.active { background: #fff; color: #000; font-weight: bold; }
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
            <div class="top-actions">
                <button class="icon-btn">EN</button>
            </div>
        </div>

        <div class="content">
            <div id="login-screen" class="screen active">
                <div class="login-container">
                    <svg class="skull-logo" viewBox="0 0 24 24" fill="white"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>
                    <h2>DRAKE</h2>
                    <p>NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</p>
                    <form id="login-form" onsubmit="handleLogin(event)">
                        <div class="input-group">
                            <label>■ ACCESS KEY</label>
                            <div class="input-row">
                                <input type="text" id="key-input" name="key" placeholder="DRKE-XXXX-XXXX-XXXX" required>
                                <button type="button" class="icon-btn" onclick="pasteKey()">PASTE</button>
                            </div>
                        </div>
                        <button type="submit" class="action-btn">UNLOCK</button>
                        <div id="login-error" class="error-msg"></div>
                    </form>
                    <div class="footer-note" style="margin-top:20px; font-size:9px; color:var(--text-muted); line-height:1.5;">
                        no key? contact your seller.<br>your time starts when you connect.
                    </div>
                </div>
            </div>

            <div id="home-screen" class="screen">
                <div class="status-row">
                    <span id="conn-status" style="color:#4caf50;">■ ONLINE</span>
                    <span>LAST REFRESHED JUST NOW</span>
                </div>
                <div class="timer-section">
                    <svg class="timer-skull" viewBox="0 0 24 24" fill="white"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>
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
                <div class="sub-box" onclick="openVpnApp()" style="cursor: pointer;">
                    <div>
                        <h3>ADD SUBSCRIPTION</h3>
                        <p>opens your vpn app with your key ready</p>
                    </div>
                    <button class="add-btn">+</button>
                </div>
            </div>

            <div id="features-screen" class="screen">
                <div class="features-top-note">
                    <span>changes apply from your next match</span>
                    <span style="color:#fff; font-weight:bold;">5/5</span>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">01 MARKER</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">marks every enemy on your screen.</div>
                    <span class="style-label">MARK STYLE</span>
                    <div class="style-grid">
                        <div class="style-btn active" onclick="selectStyle(this)">DRAKE</div>
                        <div class="style-btn" onclick="selectStyle(this)">DREAM</div>
                        <div class="style-btn" onclick="selectStyle(this)">ICE WALL</div>
                        <div class="style-btn" onclick="selectStyle(this)">MOCO</div>
                        <div class="style-btn" onclick="selectStyle(this)">CLU</div>
                        <div class="style-btn" onclick="selectStyle(this)">SHIROU</div>
                        <div class="style-btn" onclick="selectStyle(this)">IRIS</div>
                        <div class="style-btn" onclick="selectStyle(this)">DREKI</div>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">02 AIMPOINT <span style="font-size:6px; background:#333; padding:1px 3px;">NEW</span></span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">moves your aim from the chest toward the head. slide to choose how far.</div>
                    <div style="font-size:11px; font-weight:bold; color:#ff5252; margin-bottom:5px;">AIM HEIGHT: <span id="aim-val">100%</span> (HEAD)</div>
                    <div class="aim-slider-container">
                        <div class="body-preview">
                            <svg width="35" height="55" viewBox="0 0 24 24" fill="#ff5252"><path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M19,15C19,12.5 14.5,11 12,11C9.5,11 5,12.5 5,15V22H19V15Z"/></svg>
                        </div>
                        <div class="slider-box">
                            <input type="range" min="0" max="100" value="100" class="custom-range" id="aimRange" oninput="updateAim(this.value)">
                            <div class="range-labels">
                                <span>CHEST (0%)</span>
                                <span>HEAD (100%)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">03 AIM LAG</span>
                        <label class="switch"><input type="checkbox"><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">freezes the enemy for a moment while you fire or scope, so they're easier to hit.</div>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#0c0c0c; padding:8px; margin-bottom:6px; border:1px solid #222;">
                        <span style="font-size:9px;">when firing</span>
                        <label class="switch" style="transform:scale(0.8)"><input type="checkbox"><span class="slider-switch"></span></label>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#0c0c0c; padding:8px; border:1px solid #222;">
                        <span style="font-size:9px;">when scoping</span>
                        <label class="switch" style="transform:scale(0.8)"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">04 GLOO WALL ROTATION</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">turns your gloo wall to the angle you set.</div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; margin-bottom:5px;">
                        <span style="font-size:9px; color:var(--text-muted);">WALL ANGLE</span>
                        <span id="angle-val" style="color:#fff;">180°</span>
                    </div>
                    <input type="range" min="-90" max="180" value="180" class="custom-range" oninput="updateAngle(this.value)">
                    <div class="angle-grid">
                        <div class="angle-btn" onclick="setAngle(this, -90)">-90°</div>
                        <div class="angle-btn" onclick="setAngle(this, 0)">0°</div>
                        <div class="angle-btn" onclick="setAngle(this, 90)">+90°</div>
                        <div class="angle-btn active" onclick="setAngle(this, 180)">180°</div>
                    </div>
                </div>
                <div class="feature-card">
                    <div class="feature-header">
                        <span class="feature-title">05 FAST REVIVE</span>
                        <label class="switch"><input type="checkbox" checked><span class="slider-switch"></span></label>
                    </div>
                    <div class="feature-desc">picks up a knocked teammate in about 0.1 s instead of 3 s.</div>
                </div>
            </div>

            <div id="manage-screen" class="screen">
                <div class="feature-card" style="margin-bottom:15px;">
                    <div style="font-size:8px; color:var(--text-muted); letter-spacing:1px;">THIS DEVICE</div>
                    <div id="manage-device-name" style="font-size:13px; font-weight:bold; margin:4px 0;">-</div>
                    <button class="action-btn" onclick="resetDevice()" style="background:#1a1a1a; color:#fff; border:1px solid #333; padding:10px; margin-top:8px; font-size:11px;">RESET DEVICE</button>
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
            alert("Key copied to clipboard!");
        }

        function openVpnApp() {
            const subUrl = window.location.origin + "/sub/" + currentKey;
            navigator.clipboard.writeText(subUrl).then(() => {
                window.location.href = "happ://import/" + encodeURIComponent(subUrl); 
            }).catch(err => {
                console.log("Clipboard error");
            });
        }

        function selectStyle(el) {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
        }

        function updateAim(val) {
            document.getElementById('aim-val').innerText = val + '%';
        }

        function updateAngle(val) {
            document.getElementById('angle-val').innerText = val + '°';
        }

        function setAngle(el, val) {
            document.querySelectorAll('.angle-btn').forEach(b => b.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('angle-val').innerText = val + '°';
        }

        async function handleLogin(e) {
            e.preventDefault();
            const key = document.getElementById('key-input').value.trim();
            const deviceInfo = navigator.userAgent.includes("Android") ? "Android Device" : "PC / Web";
            
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, deviceInfo })
            });
            const data = await res.json();

            if(data.success) {
                currentKey = key;
                expiryTimeMs = new Date(data.rawExpiry).getTime();
                loadDashboardData(data);
                
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                document.getElementById('home-screen').classList.add('active');
                document.getElementById('bottom-nav').style.display = 'flex';
                document.getElementById('page-title').innerText = "HOME";

                startCountdown();
            } else {
                document.getElementById('login-error').innerText = data.message;
            }
        }

        function loadDashboardData(data) {
            document.getElementById('display-key').innerText = data.key;
            document.getElementById('info-activated').innerText = data.activated || '-';
            document.getElementById('info-expires').innerText = data.expires || '-';
            document.getElementById('info-device').innerText = data.device || 'Connected';
            document.getElementById('manage-device-name').innerText = data.device || 'Connected';
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

                let timeStr = "";
                if (days > 0) {
                    timeStr = days + "D " + hours + "H";
                } else if (hours > 0) {
                    timeStr = hours + "H " + minutes + "M";
                } else {
                    timeStr = minutes + "M " + seconds + "S";
                }
                document.getElementById('time-left-display').innerText = timeStr;
            }, 1000);
        }

        function switchTab(tabName, element) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            if(tabName === 'home') {
                document.getElementById('home-screen').classList.add('active');
                document.getElementById('page-title').innerText = "HOME";
            } else if(tabName === 'features') {
                document.getElementById('features-screen').classList.add('active');
                document.getElementById('page-title').innerText = "FEATURES";
            } else if(tabName === 'manage') {
                document.getElementById('manage-screen').classList.add('active');
                document.getElementById('page-title').innerText = "MANAGE";
            }
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
            <label>Duration Value:</label>
            <input type="number" step="0.1" name="duration" value="2" required>
            
            <label>Duration Type:</label>
            <select name="type">
                <option value="hours" selected>Hours</option>
                <option value="days">Days</option>
            </select>

            <label>Count:</label>
            <input type="number" name="count" value="1" min="1" max="50" required>
            
            <button type="submit">GENERATE KEYS</button>
        </form>
        <h3 style="margin-top:25px; font-size:14px;">Existing Keys Database</h3>
        <table>
            <tr><th>Key</th><th>Duration</th><th>Status</th><th>Device</th></tr>
            {{KEY_LIST}}
        </table>
    </div>
</body>
</html>`;

app.get('/', (req, res) => { res.send(htmlPage); });

// Subscription route for Happ app import
app.get('/sub/:key', (req, res) => {
  const { key } = req.params;
  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);
  
  if (!keyRow || keyRow.status !== 'active') {
    return res.status(403).send('Invalid or expired key');
  }

  const proxyConfig = `vless://drake-${key}@127.0.0.1:443?encryption=none&security=none&type=tcp#Drake-Key-${key}`;
  const encodedConfig = Buffer.from(proxyConfig).toString('base64');
  res.send(encodedConfig);
});

app.post('/api/verify', (req, res) => {
  const { key, deviceInfo } = req.body;
  const keyRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);
  if (!keyRow) { return res.json({ success: false, message: 'Invalid access key!' }); }

  const now = new Date();
  let activated = keyRow.activated_date;
  let expires = keyRow.expiry_date;

  if (keyRow.status === 'unused') {
    const expiryDate = new Date();
    if (keyRow.duration_type === 'hours') {
      expiryDate.setTime(now.getTime() + (keyRow.duration_value * 60 * 60 * 1000));
    } else {
      expiryDate.setDate(now.getDate() + parseInt(keyRow.duration_value));
    }

    activated = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    expires = expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    db.prepare(`UPDATE keys SET status = 'active', activated_date = ?, expiry_date = ?, device_info = ? WHERE key_code = ?`).run(activated, expires, deviceInfo, key);
  } else {
    if (new Date(expires) < now) { 
      return res.json({ success: false, message: 'Key has expired!' }); 
    }
  }

  const updatedRow = db.prepare('SELECT * FROM keys WHERE key_code = ?').get(key);

  let rawExpiryDate = new Date();
  if (updatedRow.duration_type === 'hours') {
    rawExpiryDate = new Date(new Date().getTime() + (updatedRow.duration_value * 60 * 60 * 1000));
  } else {
    rawExpiryDate = new Date(new Date().getTime() + (updatedRow.duration_value * 24 * 60 * 60 * 1000));
  }

  res.json({
    success: true,
    key: updatedRow.key_code,
    activated: updatedRow.activated_date,
    expires: updatedRow.expires,
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
