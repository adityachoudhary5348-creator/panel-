const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getDeviceInfo(userAgent) {
    let device = "TECNO KN3";
    let os = "Android";
    let code = "6e4aa6b19f29d74e";
    
    if (/iphone/i.test(userAgent)) {
        device = "IPHONE 11 PRO MAX";
        os = "iOS";
        code = "2zd29jp7697olnld";
    } else if (/windows/i.test(userAgent)) {
        device = "WINDOWS PC";
        os = "Windows";
        code = "win29jp7697olnld";
    }
    return { device, os, code };
}

app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const info = getDeviceInfo(ua);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DRAKE BY NULLDASH</title>
    <style>
        :root {
            --bg-color: #0b0b0b;
            --card-bg: #141414;
            --border-color: #222222;
            --text-main: #f3f3f3;
            --text-muted: #888888;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            padding-bottom: 90px;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #0b0b0b;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.8rem;
            letter-spacing: 1px;
            font-weight: bold;
        }
        .header-icons {
            display: flex;
            gap: 15px;
            font-size: 1rem;
        }
        .content-section {
            display: none;
            padding: 15px 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .content-section.active {
            display: block;
        }
        .login-hero {
            text-align: center;
            padding: 40px 0 20px 0;
        }
        .skull-img {
            width: 110px;
            height: 110px;
            background: #fff;
            margin: 0 auto 20px auto;
            clip-path: polygon(50% 0%, 100% 20%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 0% 20%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 55px;
        }
        .brand-title {
            font-size: 1.8rem;
            letter-spacing: 3px;
            font-weight: 900;
            margin: 10px 0;
        }
        .brand-subtitle {
            color: var(--text-muted);
            font-size: 0.65rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 30px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 16px;
            margin-bottom: 12px;
            position: relative;
        }
        .input-box-wrapper {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 6px;
            display: flex;
            align-items: center;
            padding: 4px 8px 4px 12px;
            margin-top: 8px;
        }
        input[type="text"] {
            flex: 1;
            background: transparent;
            border: none;
            color: #fff;
            font-family: monospace;
            font-size: 0.85rem;
            outline: none;
            letter-spacing: 1px;
        }
        .btn-paste {
            background: #1c1c1c;
            color: #fff;
            border: 1px solid #333;
            padding: 8px 14px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.7rem;
            letter-spacing: 1px;
            cursor: pointer;
        }
        .btn-unlock {
            width: 100%;
            background: #fff;
            color: #000;
            border: none;
            padding: 16px;
            border-radius: 6px;
            font-weight: 900;
            font-size: 0.95rem;
            letter-spacing: 3px;
            margin-top: 15px;
            cursor: pointer;
        }
        .add-sub-box {
            background: #141414;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-decoration: none;
            color: #fff;
            margin-top: 15px;
        }
        .add-sub-btn {
            background: #222;
            border: 1px solid #444;
            width: 36px;
            height: 36px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: bold;
        }
        .footer-info {
            text-align: center;
            color: var(--text-muted);
            font-size: 0.65rem;
            margin-top: 25px;
            line-height: 1.6;
            letter-spacing: 0.5px;
        }
        nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #0b0b0b;
            border-top: 1px solid var(--border-color);
            display: none;
            justify-content: space-around;
            padding: 12px 0 8px 0;
            z-index: 100;
        }
        .nav-item {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.6rem;
            letter-spacing: 1px;
            text-align: center;
            cursor: pointer;
            text-transform: uppercase;
        }
        .nav-item.active {
            color: #fff;
        }
        .nav-item div {
            font-size: 16px;
            margin-bottom: 2px;
        }
        .feature-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .feature-title {
            font-weight: 900;
            font-size: 0.85rem;
            letter-spacing: 1px;
        }
        .feature-desc {
            color: var(--text-muted);
            font-size: 0.68rem;
            margin-top: 4px;
            line-height: 1.4;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 24px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #1a1a1a; transition: .3s; border-radius: 4px; border: 1px solid #333;
        }
        .slider:before {
            position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px;
            background-color: white; transition: .3s; border-radius: 2px;
        }
        input:checked + .slider { background-color: #fff; }
        input:checked + .slider:before { transform: translateX(22px); background-color: #000; }
        .style-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-top: 12px;
        }
        .style-btn {
            background: #0a0a0a;
            border: 1px solid #222;
            color: var(--text-muted);
            padding: 10px 4px;
            border-radius: 4px;
            font-size: 0.6rem;
            text-align: center;
            cursor: pointer;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .style-btn.active {
            background: #fff;
            color: #000;
            border-color: #fff;
        }
        #errorMsg {
            color: #ff4d4d;
            font-size: 0.7rem;
            margin-top: 8px;
            display: none;
        }
    </style>
</head>
<body>

    <header>
        <span>DRAKE BY NULLDASH</span>
        <div class="header-icons">
            <span>🔔</span>
            <span>🌐 EN</span>
        </div>
    </header>

    <div id="login-screen" class="content-section active">
        <div class="login-hero">
            <div class="skull-img">💀</div>
            <div class="brand-title">DRAKE</div>
            <div class="brand-subtitle">NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</div>
        </div>

        <div class="card">
            <div style="font-size: 0.65rem; color: var(--text-muted); letter-spacing: 1px;">■ ACCESS KEY</div>
            <div class="input-box-wrapper">
                <input type="text" id="keyInput" placeholder="DRAKE-XXXX-XXXX-XXXX" value="DRAKE-82A6-D0C5-D56E">
                <button class="btn-paste" onclick="navigator.clipboard.readText().then(t => document.getElementById('keyInput').value = t)">PASTE</button>
            </div>
            <div id="errorMsg">Invalid Key! Please use a valid key format.</div>
        </div>

        <button class="btn-unlock" onclick="verifyKey()">UNLOCK</button>

        <a href="#" onclick="openVpnApp(event)" class="add-sub-box">
            <div>
                <div style="font-weight: 900; font-size: 0.8rem; letter-spacing: 1px;">ADD SUBSCRIPTION</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">opens your vpn app with your key ready</div>
            </div>
            <div class="add-sub-btn">+</div>
        </a>

        <div class="footer-info">
            no key? contact your seller.<br>
            your time starts when you connect.
        </div>
    </div>
    <div id="home" class="content-section">
        <div style="display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.65rem; margin-bottom: 15px; letter-spacing: 0.5px;">
            <div style="background: #1c1c1c; padding: 4px 8px; border-radius: 3px; border: 1px solid #333;">■ OFFLINE</div>
            <div>LAST REFRESHED 10 MIN AGO</div>
        </div>

        <div style="text-align: center; padding: 10px 0 25px 0;">
            <div class="skull-img" style="width: 90px; height: 90px; font-size: 45px; margin-bottom: 10px;">💀</div>
            <div id="timeDisplay" style="font-size: 2rem; font-weight: 900; letter-spacing: 2px;">1D 23H</div>
            <div style="font-size: 0.6rem; color: var(--text-muted); letter-spacing: 2px; margin-top: 2px;">TIME LEFT</div>
        </div>

        <div class="card">
            <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.5px;">KEY &nbsp; <span id="displayKeyText" style="color: #fff; font-family: monospace; font-weight: bold;">-</span></div>
            <div style="position: absolute; right: 14px; top: 12px;">
                <button class="btn-paste" onclick="navigator.clipboard.writeText(document.getElementById('displayKeyText').innerText)">📋 COPY</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div class="card" style="margin: 0; padding: 12px 8px; text-align: center;">
                <div style="font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.5px;">ACTIVATED</div>
                <div style="font-size: 0.7rem; font-weight: bold; margin-top: 4px;">26 Oct 2026</div>
            </div>
            <div class="card" style="margin: 0; padding: 12px 8px; text-align: center;">
                <div style="font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.5px;">EXPIRES</div>
                <div style="font-size: 0.7rem; font-weight: bold; margin-top: 4px;">29 Oct 2026</div>
            </div>
            <div class="card" style="margin: 0; padding: 12px 8px; text-align: center;">
                <div style="font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.5px;">DEVICE</div>
                <div style="font-size: 0.7rem; font-weight: bold; margin-top: 4px;">${info.device}</div>
            </div>
        </div>

        <a href="#" onclick="openVpnApp(event)" class="add-sub-box">
            <div>
                <div style="font-weight: 900; font-size: 0.8rem; letter-spacing: 1px;">ADD SUBSCRIPTION</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">opens your vpn app with your key ready</div>
            </div>
            <div class="add-sub-btn">+</div>
        </a>
    </div>

    <div id="features" class="content-section">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; color: var(--text-muted); margin-bottom: 15px; letter-spacing: 0.5px;">
            <span>changes apply from your next match</span>
            <span style="font-weight: bold; color: #fff;">3/5</span>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">01 MARKER</div>
                    <div class="feature-desc">marks every enemy on your screen.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="font-size: 0.6rem; color: var(--text-muted); margin: 12px 0 6px 0; letter-spacing: 0.5px;">MARK STYLE</div>
            <div class="style-grid">
                <div class="style-btn active">DRAKE</div>
                <div class="style-btn">DREAM</div>
                <div class="style-btn">ICE WALL</div>
                <div class="style-btn">NOCO</div>
                <div class="style-btn">CLU</div>
                <div class="style-btn">SHIROU</div>
                <div class="style-btn">IRIS</div>
                <div class="style-btn">DREKI</div>
            </div>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">02 AIMPOINT <span style="background:#1c1c1c; padding: 2px 6px; font-size: 0.55rem; border-radius: 3px; border:1px solid #333; font-weight:normal;">NEW</span></div>
                    <div class="feature-desc">moves your aim from the chest toward the head. slide to choose how far.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; font-size: 0.75rem;">
                <span style="color:var(--text-muted); font-size:0.6rem; letter-spacing:1px;">AIM HEIGHT</span>
                <div>
                    <span style="color:var(--text-muted); font-size:0.65rem; margin-right:5px; letter-spacing:0.5px;">NECK</span>
                    <span style="color:#ff4d4d; font-weight:900; font-size:1.1rem; letter-spacing:1px;">80%</span>
                </div>
            </div>
            <input type="range" min="0" max="100" value="80" style="width:100%; margin-top:10px; accent-color:#fff;">
            
            <div style="margin-top: 15px; border-top: 1px solid #222; padding-top: 15px;">
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#888; margin-bottom:5px;">
                    <span>HEAD</span><span style="color:#444;">100%</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#ff4d4d; font-weight:bold; margin-bottom:5px;">
                    <span>NECK</span><span>68%</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#888; margin-bottom:5px;">
                    <span>SHOULDERS</span><span style="color:#444;">50%</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#888; margin-bottom:5px;">
                    <span>UPPER CHEST</span><span style="color:#444;">30%</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#888;">
                    <span>CHEST</span><span style="color:#444;">0%</span>
                </div>
            </div>
            <div style="color: #ff4d4d; font-size: 0.65rem; margin-top: 12px; letter-spacing: 0.5px;">! may show damage that doesn't count on standing targets</div>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">03 AIM LAG</div>
                    <div class="feature-desc">freezes the enemy for a moment while you fire or scope, so they're easier to hit.</div>
                </div>
                <label class="switch"><input type="checkbox"><span class="slider"></span></label>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted); margin: 12px 0 6px 0; letter-spacing: 0.5px;">🔒 TURN ON TO CHANGE</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; background:#0a0a0a; padding:10px 14px; border-radius:4px; border:1px solid #222;">
                <span style="font-size:0.7rem; color:var(--text-muted);">when firing</span>
                <label class="switch" style="width:36px; height:20px;"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; background:#0a0a0a; padding:10px 14px; border-radius:4px; border:1px solid #222;">
                <span style="font-size:0.7rem; color:var(--text-muted);">when scoping</span>
                <label class="switch" style="width:36px; height:20px;"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">04 GLOO WALL ROTATION</div>
                    <div class="feature-desc">turns your gloo wall to the angle you set.</div>
                </div>
                <label class="switch"><input type="checkbox"><span class="slider"></span></label>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted); margin: 12px 0 6px 0; letter-spacing: 0.5px;">🔒 TURN ON TO CHANGE</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <span style="color:var(--text-muted); font-size:0.6rem; letter-spacing:1px;">WALL ANGLE</span>
                <span style="color:#fff; font-weight:900; font-size:1.1rem;">180°</span>
            </div>
            <input type="range" min="-90" max="180" value="180" style="width:100%; margin-top:8px; accent-color:#fff;">
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-top:10px;">
                <div class="style-btn">-90°</div>
                <div class="style-btn">0°</div>
                <div class="style-btn">+90°</div>
                <div class="style-btn active">180°</div>
            </div>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">05 FAST REVIVE</div>
                    <div class="feature-desc">picks up a knocked teammate in about 0.1 s instead of 3 s.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
        </div>
    </div>

    <div id="manage" class="content-section">
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.6rem; color: var(--text-muted); letter-spacing: 1px;">THIS DEVICE</span>
                <span style="background: #1c1c1c; padding: 3px 8px; border-radius: 3px; font-size: 0.55rem; color: #aaa; border: 1px solid #333; font-weight: bold; letter-spacing: 0.5px;">LOCKED TO THIS KEY</span>
            </div>
            <div style="font-size: 1.15rem; font-weight: 900; margin: 4px 0; letter-spacing: 1px;">${info.device}</div>
            <div style="font-size: 0.65rem; color: var(--text-muted);">${info.os}</div>
            <div style="font-size: 0.6rem; color: #444; font-family: monospace; margin-top: 4px;">${info.code}</div>
            <button style="width:100%; background:#1c1c1c; color:#fff; border:1px solid #333; padding:12px; border-radius:4px; font-weight:bold; font-size:0.75rem; letter-spacing:1px; margin-top:15px; cursor:pointer;">RESET DEVICE</button>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 0.6rem; color: var(--text-muted); letter-spacing: 1px;">UPDATE NOTES</span>
                <span style="font-size: 0.6rem; color: var(--text-muted); cursor: pointer;">ALL UPDATES ↗</span>
            </div>
            <div style="font-weight: 900; font-size: 0.8rem; margin-bottom: 6px; letter-spacing: 0.5px;">V1.7 AIM LAG IS BACK, NEXT TO AIMPOINT</div>
            <div style="font-size: 0.68rem; color: var(--text-muted); line-height: 1.5;">aim lag is back, sitting under aimpoint. run it with aimpoint or on its own. every feature now carries a shor...</div>
        </div>

        <div class="card" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="window.open('https://t.me', '_blank')">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #222; width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem;">D</div>
                <div>
                    <div style="font-weight: 900; font-size: 0.8rem; letter-spacing: 1px;">DISCORD</div>
                </div>
            </div>
            <span style="color: var(--text-muted);">↗</span>
        </div>

        <div class="card" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="window.open('https://whatsapp.com', '_blank')">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="background: #222; width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem;">W</div>
                <div>
                    <div style="font-weight: 900; font-size: 0.8rem; letter-spacing: 1px;">WHATSAPP</div>
                </div>
            </div>
            <span style="color: var(--text-muted);">↗</span>
        </div>

        <button onclick="logoutSession()" style="width:100%; background:rgba(255, 77, 77, 0.1); color:#ff4d4d; border:1px solid rgba(255, 77, 77, 0.3); padding:14px; border-radius:4px; font-weight:900; font-size:0.8rem; letter-spacing:2px; margin-top:10px; cursor:pointer;">🚪 LOG OUT</button>
    </div>

    <nav id="bottomNav">
        <button class="nav-item active" onclick="switchTab('home')">
            <div>🏠</div>HOME
        </button>
        <button class="nav-item" onclick="switchTab('features')">
            <div>⚡</div>FEATURES
        </button>
        <button class="nav-item" onclick="switchTab('manage')">
            <div>⚙️</div>MANAGE
        </button>
    </nav>

    <script>
        function switchTab(tabId) {
            document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            
            document.getElementById(tabId).classList.add('active');
            
            if(tabId === 'home') document.querySelectorAll('.nav-item')[0].classList.add('active');
            if(tabId === 'features') document.querySelectorAll('.nav-item')[1].classList.add('active');
            if(tabId === 'manage') document.querySelectorAll('.nav-item')[2].classList.add('active');
        }

        function verifyKey() {
            const key = document.getElementById('keyInput').value.trim();
            const err = document.getElementById('errorMsg');
            
            if(key.startsWith('DRAKE-')) {
                err.style.display = 'none';
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('bottomNav').style.display = 'flex';
                document.getElementById('displayKeyText').innerText = key;
                switchTab('home');
            } else {
                err.style.display = 'block';
                err.innerText = 'Invalid Key! Please use a valid key format.';
            }
        }

        function logoutSession() {
            document.getElementById('bottomNav').style.display = 'none';
            document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
            document.getElementById('login-screen').classList.add('active');
            document.getElementById('keyInput').value = '';
        }

        function openVpnApp(e) {
            e.preventDefault();
            window.location.href = "happ://";
            setTimeout(() => {
                alert("Add Subscription: VPN app launched successfully with your active key!");
            }, 500);
        }
    </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
