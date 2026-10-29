const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getDeviceInfo(userAgent) {
    let device = "Android Device";
    let os = "Android";
    
    if (/iphone/i.test(userAgent)) {
        device = "iPhone / iOS Device";
        os = "iOS";
    } else if (/ipad/i.test(userAgent)) {
        device = "iPad";
        os = "iOS";
    } else if (/windows/i.test(userAgent)) {
        device = "Windows PC";
        os = "Windows";
    } else if (/macintosh/i.test(userAgent)) {
        device = "Macbook / Mac";
        os = "MacOS";
    }
    return { device, os };
}

app.get('/', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  const info = getDeviceInfo(ua);

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DRAKE PANEL</title>
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
            padding-bottom: 80px;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #111;
            border-bottom: 1px solid var(--border-color);
            font-size: 0.85rem;
            letter-spacing: 1px;
        }
        .content-section {
            display: none;
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .content-section.active {
            display: block;
        }
        .hero {
            text-align: center;
            padding: 20px 0;
        }
        .skull-logo {
            width: 80px;
            height: 80px;
            background: #fff;
            margin: 0 auto 12px auto;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 35px;
        }
        h1 {
            font-size: 1.4rem;
            letter-spacing: 2px;
            margin: 5px 0;
        }
        .tagline {
            color: var(--text-muted);
            font-size: 0.7rem;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }
        .card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 15px;
        }
        .input-group {
            display: flex;
            gap: 10px;
            margin-top: 8px;
        }
        input[type="text"] {
            flex: 1;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: monospace;
            font-size: 0.85rem;
        }
        .btn-action {
            background: #222;
            color: #fff;
            border: 1px solid #444;
            padding: 0 16px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 0.75rem;
        }
        .btn-unlock {
            width: 100%;
            background: #fff;
            color: #000;
            border: none;
            padding: 14px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 0.9rem;
            letter-spacing: 2px;
            margin-top: 10px;
            cursor: pointer;
        }
        .add-sub-card {
            background: linear-gradient(135deg, #181818, #222);
            border: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-decoration: none;
            color: #fff;
            padding: 16px;
            border-radius: 12px;
            margin-top: 15px;
        }
        .footer-note {
            text-align: center;
            color: var(--text-muted);
            font-size: 0.7rem;
            margin-top: 15px;
            line-height: 1.4;
        }
        nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #0e0e0e;
            border-top: 1px solid var(--border-color);
            display: none;
            justify-content: space-around;
            padding: 10px 0;
            z-index: 100;
        }
        .nav-item {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.65rem;
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
            margin-bottom: 8px;
        }
        .feature-title {
            font-weight: bold;
            font-size: 0.85rem;
            letter-spacing: 1px;
        }
        .feature-desc {
            color: var(--text-muted);
            font-size: 0.7rem;
            margin-top: 3px;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #222; transition: .3s; border-radius: 22px; border: 1px solid #444;
        }
        .slider:before {
            position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px;
            background-color: white; transition: .3s; border-radius: 50%;
        }
        input:checked + .slider { background-color: #fff; }
        input:checked + .slider:before { transform: translateX(18px); background-color: #000; }
        .style-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-top: 10px;
        }
        .style-btn {
            background: #0d0d0d;
            border: 1px solid #333;
            color: var(--text-muted);
            padding: 8px 4px;
            border-radius: 6px;
            font-size: 0.65rem;
            text-align: center;
            cursor: pointer;
        }
        .style-btn.active {
            background: #fff;
            color: #000;
            font-weight: bold;
            border-color: #fff;
        }
        #errorMsg {
            color: #ff4d4d;
            font-size: 0.75rem;
            text-align: center;
            margin-top: 8px;
            display: none;
        }
    </style>
</head>
<body>

    <header>
        <span>DRAKE PANEL</span>
        <span>EN</span>
    </header>

    <div id="login-screen" class="content-section active">
        <div class="hero">
            <div class="skull-logo">💀</div>
            <h1>DRAKE PANEL</h1>
            <div class="tagline">NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</div>
        </div>

        <div class="card">
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 5px;">■ ACCESS KEY</div>
            <div class="input-group">
                <input type="text" id="keyInput" placeholder="DRAKE-XXXX-XXXX-XXXX" value="DRAKE-1111-2222-3333">
                <button class="btn-action" onclick="navigator.clipboard.readText().then(t => document.getElementById('keyInput').value = t)">PASTE</button>
            </div>
            <div id="errorMsg">Invalid Key! Use key: DRAKE-1111-2222-3333</div>
        </div>

        <button class="btn-unlock" onclick="verifyKey()">UNLOCK</button>

        <a href="#" onclick="openVpnApp(event)" class="add-sub-card">
            <div>
                <div style="font-weight: bold; font-size: 0.85rem; letter-spacing: 1px;">ADD SUBSCRIPTION</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">opens your vpn app with your key ready</div>
            </div>
            <div style="background: #333; padding: 10px 14px; border-radius: 8px; font-size: 1.1rem; font-weight: bold;">+</div>
        </a>

        <div class="footer-note">
            no key? contact your seller.<br>
            your time starts when you connect.
        </div>
    </div>
    <div id="home" class="content-section">
        <div class="hero" style="padding: 10px 0;">
            <div class="skull-logo">💀</div>
            <div style="font-size: 1.8rem; font-weight: bold; letter-spacing: 2px; margin-top: 5px;">2H 11M</div>
            <div style="font-size: 0.65rem; color: var(--text-muted); letter-spacing: 1px; margin-top: 2px;">TIME LEFT</div>
        </div>

        <div class="card">
            <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">KEY</div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: #0a0a0a; padding: 10px; border-radius: 8px; border: 1px solid #333;">
                <span id="activeKeyText" style="font-family: monospace; font-size: 0.85rem; color: #fff;">-</span>
                <button class="btn-action" onclick="navigator.clipboard.writeText(document.getElementById('activeKeyText').innerText)">COPY</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div class="card" style="margin: 0; padding: 12px; text-align: center;">
                <div style="font-size: 0.6rem; color: var(--text-muted);">ACTIVATED</div>
                <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">29 Oct 2026</div>
            </div>
            <div class="card" style="margin: 0; padding: 12px; text-align: center;">
                <div style="font-size: 0.6rem; color: var(--text-muted);">EXPIRES</div>
                <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">30 Oct 2026</div>
            </div>
            <div class="card" style="margin: 0; padding: 12px; text-align: center;">
                <div style="font-size: 0.6rem; color: var(--text-muted);">DEVICE</div>
                <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">${info.device}</div>
            </div>
        </div>

        <a href="#" onclick="openVpnApp(event)" class="add-sub-card">
            <div>
                <div style="font-weight: bold; font-size: 0.85rem; letter-spacing: 1px;">ADD SUBSCRIPTION</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">opens your vpn app with your key ready</div>
            </div>
            <div style="background: #333; padding: 10px 14px; border-radius: 8px; font-size: 1.1rem; font-weight: bold;">+</div>
        </a>
    </div>

    <div id="features" class="content-section">
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 12px;">CHANGES APPLY FROM YOUR NEXT MATCH</div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">01 MARKER</div>
                    <div class="feature-desc">marks every enemy on your screen.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="font-size: 0.65rem; color: var(--text-muted); margin: 10px 0 4px 0;">MARK STYLE</div>
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
                    <div class="feature-title">02 AIMPOINT <span style="background:#222; padding: 2px 5px; font-size: 0.55rem; border-radius: 4px; border:1px solid #444;">NEW</span></div>
                    <div class="feature-desc">moves your aim from chest to head. slide to choose how far.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:12px; font-size: 0.75rem; color:#888;">
                <span>AIM HEIGHT</span>
                <span style="color:#ff4d4d; font-weight:bold; font-size:1rem;">100%</span>
            </div>
            <input type="range" min="0" max="100" value="100" style="width:100%; margin-top:8px; accent-color:#fff;">
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">03 AIM LAG</div>
                    <div class="feature-desc">freezes enemy for a moment while firing or scoping.</div>
                </div>
                <label class="switch"><input type="checkbox"><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; background:#0a0a0a; padding:10px; border-radius:8px; border:1px solid #222;">
                <span style="font-size:0.75rem; color:var(--text-muted);">when firing</span>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; background:#0a0a0a; padding:10px; border-radius:8px; border:1px solid #222;">
                <span style="font-size:0.75rem; color:var(--text-muted);">when scoping</span>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
        </div>

        <div class="card">
            <div class="feature-row">
                <div>
                    <div class="feature-title">04 GLOO WALL ROTATION</div>
                    <div class="feature-desc">turns your gloo wall to the angle you set.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:12px; font-size: 0.75rem; color:#888;">
                <span>WALL ANGLE</span>
                <span style="color:#fff; font-weight:bold; font-size:1rem;">180°</span>
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
                    <div class="feature-desc">picks up knocked teammate in about 0.1 s instead of 3 s.</div>
                </div>
                <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
            </div>
        </div>
    </div>

    <div id="manage" class="content-section">
        <div class="card">
            <div style="font-size: 0.65rem; color: var(--text-muted);">THIS DEVICE</div>
            <div style="font-size: 1.1rem; font-weight: bold; margin: 4px 0; letter-spacing: 1px;">${info.device}</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">${info.os} • Active Session</div>
            <div style="margin-top: 12px; background: #0a0a0a; padding: 8px; border-radius: 6px; text-align: center; font-size: 0.7rem; color: #34d399; border: 1px solid #113f2d;">
                LOCKED TO THIS KEY • VALID
            </div>
        </div>

        <div class="card">
            <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">UPDATE NOTES</div>
            <div style="font-weight: bold; font-size: 0.8rem; margin-bottom: 4px;">V1.7 AIM LAG IS BACK, NEXT TO AIMPOINT</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">aim lag is back, sitting under aimpoint. run it with aimpoint or on its own.</div>
        </div>

        <div class="card" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="window.open('https://discord.com', '_blank')">
            <div>
                <div style="font-weight: bold; font-size: 0.8rem;">DISCORD</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">join community server</div>
            </div>
            <span>↗</span>
        </div>

        <div class="card" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="window.open('https://whatsapp.com', '_blank')">
            <div>
                <div style="font-weight: bold; font-size: 0.8rem;">WHATSAPP</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">official updates group</div>
            </div>
            <span>↗</span>
        </div>
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
            
            if(key === 'DRAKE-1111-2222-3333' || key.startsWith('DRAKE-')) {
                err.style.display = 'none';
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('bottomNav').style.display = 'flex';
                document.getElementById('activeKeyText').innerText = key;
                switchTab('home');
            } else {
                err.style.display = 'block';
                err.innerText = 'Invalid Key! Use key: DRAKE-1111-2222-3333';
            }
        }

        function openVpnApp(e) {
            e.preventDefault();
            window.location.href = "happ://";
            setTimeout(() => {
                alert("Add Subscription: VPN app launched successfully with your active session key!");
            }, 500);
        }
    </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
