const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
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
                --accent: #ffffff;
            }
            body {
                background-color: var(--bg-color);
                color: var(--text-main);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                padding: 0;
                padding-bottom: 70px;
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
                padding: 30px 0;
            }
            .skull-logo {
                width: 90px;
                height: 90px;
                background: #fff;
                margin: 0 auto 15px auto;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
            }
            h1 {
                font-size: 1.5rem;
                letter-spacing: 2px;
                margin: 10px 0 5px 0;
            }
            .tagline {
                color: var(--text-muted);
                font-size: 0.75rem;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 25px;
            }
            .card {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 18px;
                margin-bottom: 15px;
            }
            .input-group {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            input[type="text"] {
                flex: 1;
                background: #0a0a0a;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 12px;
                color: #fff;
                font-family: monospace;
                font-size: 0.9rem;
            }
            .btn-action {
                background: #222;
                color: #fff;
                border: 1px solid #444;
                padding: 0 18px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 0.8rem;
                letter-spacing: 1px;
            }
            .btn-unlock {
                width: 100%;
                background: #fff;
                color: #000;
                border: none;
                padding: 15px;
                border-radius: 8px;
                font-weight: bold;
                font-size: 0.9rem;
                letter-spacing: 2px;
                margin-top: 15px;
                cursor: pointer;
            }
            .footer-note {
                text-align: center;
                color: var(--text-muted);
                font-size: 0.75rem;
                margin-top: 20px;
                line-height: 1.5;
            }
            /* Nav bar */
            nav {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: #0e0e0e;
                border-top: 1px solid var(--border-color);
                display: flex;
                justify-content: space-around;
                padding: 10px 0;
                z-index: 100;
            }
            .nav-item {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 0.7rem;
                letter-spacing: 1px;
                text-align: center;
                cursor: pointer;
                text-transform: uppercase;
            }
            .nav-item.active {
                color: #fff;
            }
            .nav-item div {
                font-size: 18px;
                margin-bottom: 3px;
            }
            /* Features styles */
            .feature-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .feature-title {
                font-weight: bold;
                font-size: 0.9rem;
                letter-spacing: 1px;
            }
            .feature-desc {
                color: var(--text-muted);
                font-size: 0.75rem;
                margin-top: 5px;
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #222; transition: .3s; border-radius: 24px; border: 1px solid #444;
            }
            .slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px;
                background-color: white; transition: .3s; border-radius: 50%;
            }
            input:checked + .slider { background-color: #fff; }
            input:checked + .slider:before { transform: translateX(20px); background-color: #000; }
            
            .style-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                margin-top: 12px;
            }
            .style-btn {
                background: #0d0d0d;
                border: 1px solid #333;
                color: var(--text-muted);
                padding: 10px 5px;
                border-radius: 6px;
                font-size: 0.7rem;
                text-align: center;
                cursor: pointer;
            }
            .style-btn.active {
                background: #fff;
                color: #000;
                font-weight: bold;
                border-color: #fff;
            }
        </style>
    </head>
    <body>

        <header>
            <span>DRAKE BY NULLDASH</span>
            <span>EN</span>
        </header>

        <!-- HOME TAB -->
        <div id="home" class="content-section active">
            <div class="hero">
                <div class="skull-logo">💀</div>
                <h1>DRAKE</h1>
                <div class="tagline">NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</div>
            </div>

            <div class="card">
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 5px;">■ ACCESS KEY</div>
                <div class="input-group">
                    <input type="text" id="keyInput" placeholder="PHTM-XXXX-XXXX-XXXX" value="PHTM-E9E0-1A89-A3E7">
                    <button class="btn-action" onclick="navigator.clipboard.writeText(document.getElementById('keyInput').value)">PASTE</button>
                </div>
            </div>

            <button class="btn-unlock" onclick="switchTab('features')">UNLOCK</button>

            <div class="footer-note">
                no key? contact your seller.<br>
                your time starts when you connect.
            </div>
        </div>

        <!-- FEATURES TAB -->
        <div id="features" class="content-section">
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 15px;">CHANGES APPLY FROM YOUR NEXT MATCH</div>

            <!-- Feature 1 -->
            <div class="card">
                <div class="feature-row">
                    <div>
                        <div class="feature-title">01 MARKER</div>
                        <div class="feature-desc">marks every enemy on your screen.</div>
                    </div>
                    <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin: 12px 0 5px 0;">MARK STYLE</div>
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

            <!-- Feature 2 -->
            <div class="card">
                <div class="feature-row">
                    <div>
                        <div class="feature-title">02 AIMPOINT <span style="background:#222; padding: 2px 6px; font-size: 0.6rem; border-radius: 4px; border:1px solid #444;">NEW</span></div>
                        <div class="feature-desc">moves your aim from the chest toward the head. slide to choose how far.</div>
                    </div>
                    <label class="switch"><input type="checkbox" checked><span class="slider"></span></label>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:15px; font-size: 0.8rem; color:#888;">
                    <span>AIM HEIGHT</span>
                    <span style="color:#ff4d4d; font-weight:bold; font-size:1.1rem;">100%</span>
                </div>
                <input type="range" min="0" max="100" value="100" style="width:100%; margin-top:10px; accent-color:#fff;">
            </div>
        </div>

        <!-- MANAGE TAB -->
        <div id="manage" class="content-section">
            <div class="card">
                <div style="font-size: 0.7rem; color: var(--text-muted);">THIS DEVICE</div>
                <div style="font-size: 1.2rem; font-weight: bold; margin: 5px 0; letter-spacing: 1px;">IPHONE 11 PRO MAX</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">iOS • 2zd29jp7697olnld</div>
                <div style="margin-top: 15px; background: #0a0a0a; padding: 10px; border-radius: 6px; text-align: center; font-size: 0.75rem; color: var(--text-muted); border: 1px solid #222;">
                    LOCKED TO THIS KEY • NEXT RESET 5 NOV 2026
                </div>
            </div>

            <div class="card">
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 5px;">UPDATE NOTES</div>
                <div style="font-weight: bold; font-size: 0.85rem; margin-bottom: 5px;">V1.7 AIM LAG IS BACK, NEXT TO AIMPOINT</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">aim lag is back, sitting under aimpoint. run it with aimpoint or on its own.</div>
            </div>

            <div class="card" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <div style="font-weight: bold; font-size: 0.85rem;">DISCORD</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">join community server</div>
                </div>
                <span>↗</span>
            </div>
        </div>

        <!-- NAVIGATION -->
        <nav>
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
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
