<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phantom Panel</title>
    <style>
        :root {
            --bg-color: #0c0c0c;
            --card-bg: #141414;
            --border-color: #262626;
            --text-main: #ffffff;
            --text-muted: #888888;
            --accent: #ffffff;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: monospace, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow-x: hidden;
        }

        .phone-frame {
            width: 100%;
            max-width: 420px;
            height: 100vh;
            max-height: 850px;
            background: var(--bg-color);
            border: 2px solid var(--border-color);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
        }

        /* Top Bar */
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .top-bar h1 {
            font-size: 18px;
            letter-spacing: 2px;
        }

        .top-actions {
            display: flex;
            gap: 10px;
        }

        .icon-btn {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 4px;
        }

        /* Content Area */
        .content {
            flex: 1;
            padding: 20px;
            padding-bottom: 80px;
        }

        .screen {
            display: none;
        }

        .screen.active {
            display: block;
        }

        /* Login Screen */
        .login-container {
            text-align: center;
            margin-top: 40px;
        }

        .skull-logo {
            width: 120px;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }

        .login-container h2 {
            font-size: 24px;
            letter-spacing: 3px;
            margin-bottom: 5px;
        }

        .login-container p {
            font-size: 11px;
            color: var(--text-muted);
            margin-bottom: 30px;
            letter-spacing: 1px;
        }

        .input-group {
            text-align: left;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 12px;
            margin-bottom: 20px;
            position: relative;
        }

        .input-group label {
            display: block;
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 5px;
            letter-spacing: 1px;
        }

        .input-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .input-row input {
            background: transparent;
            border: none;
            color: var(--text-main);
            font-size: 14px;
            outline: none;
            width: 70%;
            letter-spacing: 1px;
        }

        .action-btn {
            width: 100%;
            background: var(--text-main);
            color: var(--bg-color);
            border: none;
            padding: 15px;
            font-weight: bold;
            font-size: 14px;
            letter-spacing: 2px;
            cursor: pointer;
            margin-top: 10px;
            clip-path: polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%);
        }

        .footer-note {
            margin-top: 20px;
            font-size: 10px;
            color: var(--text-muted);
            line-height: 1.5;
        }

        /* Home Dashboard */
        .status-bar {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
        }

        .timer-circle {
            text-align: center;
            position: relative;
            margin: 20px 0;
        }

        .timer-circle img {
            width: 180px;
            opacity: 0.9;
        }

        .time-display {
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .time-label {
            font-size: 9px;
            color: var(--text-muted);
            letter-spacing: 2px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            margin-bottom: 15px;
        }

        .info-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 10px;
            text-align: center;
        }

        .info-card span {
            display: block;
            font-size: 9px;
            color: var(--text-muted);
            margin-bottom: 5px;
        }

        .info-card strong {
            font-size: 11px;
            word-break: break-all;
        }

        .sub-box {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 0 100%);
        }

        .sub-box h3 {
            font-size: 13px;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }

        .sub-box p {
            font-size: 10px;
            color: var(--text-muted);
        }

        .add-btn {
            background: #222;
            border: 1px solid var(--border-color);
            color: white;
            width: 35px;
            height: 35px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        /* Features & Manage Elements */
        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 15px;
            margin-bottom: 15px;
        }

        .feature-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }

        .feature-desc {
            font-size: 10px;
            color: var(--text-muted);
            margin-bottom: 10px;
        }

        /* Bottom Navigation */
        .nav-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #0f0f0f;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
        }

        .nav-item {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 9px;
            text-align: center;
            cursor: pointer;
            letter-spacing: 1px;
        }

        .nav-item.active {
            color: var(--text-main);
        }

        .nav-item div {
            font-size: 16px;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>

    <div class="phone-frame">
        <!-- Top Bar -->
        <div class="top-bar">
            <h1 id="page-title">PHANTOM</h1>
            <div class="top-actions">
                <button class="icon-btn">🔔</button>
                <button class="icon-btn">EN</button>
            </div>
        </div>

        <!-- Main Content Screens -->
        <div class="content">
            
            <!-- 1. Login Screen -->
            <div id="login-screen" class="screen active">
                <div class="login-container">
                    <!-- Skull SVG / Image placeholder -->
                    <svg class="skull-logo" viewBox="0 0 24 24" fill="white"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>
                    <h2>PHANTOM</h2>
                    <p>NO ACCOUNT. NO PASSWORD. JUST YOUR KEY.</p>
                    
                    <div class="input-group">
                        <label>■ ACCESS KEY</label>
                        <div class="input-row">
                            <input type="text" id="key-input" placeholder="PHTM-XXXX-XXXX-XXXX">
                            <button class="icon-btn" onclick="pasteKey()">PASTE</button>
                        </div>
                    </div>

                    <button class="action-btn" onclick="unlockPanel()">UNLOCK</button>

                    <div class="footer-note">
                        no key? contact your seller.<br>
                        your time starts when you connect.
                    </div>
                </div>
            </div>

            <!-- 2. Home Dashboard Screen -->
            <div id="home-screen" class="screen">
                <div class="status-bar">
                    <span>■ OFFLINE</span>
                    <span>LAST REFRESHED 10 MIN AGO</span>
                </div>

                <div class="timer-circle">
                    <!-- Circular meter decoration -->
                    <svg width="180" height="180" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#222" stroke-width="2" stroke-dasharray="5 5"/>
                    </svg>
                    <div class="time-display">
                        1D 23H
                        <div class="time-label">TIME LEFT</div>
                    </div>
                </div>

                <div class="input-group" style="padding: 8px 12px;">
                    <label>KEY <span id="active-key-text" style="color:#fff;">PHTM-82A6-D0C5-D56E</span></label>
                </div>

                <div class="info-grid">
                    <div class="info-card">
                        <span>ACTIVATED</span>
                        <strong>26 Oct 2026</strong>[span_2](start_span)[span_2](end_span)
                    </div>
                    <div class="info-card">
                        <span>EXPIRES</span>
                        <strong>29 Oct 2026</strong>[span_3](start_span)[span_3](end_span)
                    </div>
                    <div class="info-card">
                        <span>DEVICE</span>
                        <strong>TECNO KN3</strong>[span_4](start_span)[span_4](end_span)
                    </div>
                </div>

                <div class="sub-box">
                    <div>
                        <h3>ADD SUBSCRIPTION</h3>
                        <p>opens your vpn app with your key ready</p>[span_5](start_span)[span_5](end_span)
                    </div>
                    <button class="add-btn">+</button>
                </div>
            </div>

            <!-- 3. Features Screen -->
            <div id="features-screen" class="screen">
                <div class="feature-card">
                    <div class="feature-title">01 MARKER</div>
                    <div class="feature-desc">marks every enemy on your screen.</div>[span_6](start_span)[span_6](end_span)
                </div>
                <div class="feature-card">
                    <div class="feature-title">02 AIMPOINT <span style="font-size:8px; background:#333; padding:2px 5px;">NEW</span></div>
                    <div class="feature-desc">moves your aim from the chest toward the head.</div>[span_7](start_span)[span_7](end_span)
                </div>
            </div>

            <!-- 4. Manage Screen -->
            <div id="manage-screen" class="screen">
                <div class="feature-card">
                    <div style="font-size:9px; color:var(--text-muted)">THIS DEVICE</div>
                    <div style="font-size:14px; font-weight:bold; margin:5px 0;">TECNO KN3</div>[span_8](start_span)[span_8](end_span)
                    <button class="action-btn" style="background:#1a1a1a; color:#fff; border:1px solid #333; padding:10px; margin-top:10px;">RESET DEVICE</button>[span_9](start_span)[span_9](end_span)
                </div>
                <button class="action-btn" onclick="logout()" style="background:#3a1515; color:#ff6b6b; border:1px solid #522;">LOG OUT</button>[span_10](start_span)[span_10](end_span)
            </div>

        </div>

        <!-- Bottom Navigation Bar -->
        <div class="nav-bar">
            <button class="nav-item active" onclick="switchTab('home', this)">
                <div>🏠</div>HOME
            </button>
            <button class="nav-item" onclick="switchTab('features', this)">
                <div>🎛️</div>FEATURES
            </button>
            <button class="nav-item" onclick="switchTab('manage', this)">
                <div>⚙️</div>MANAGE
            </button>
        </div>
    </div>
    <script>
        function pasteKey() {
            // Dummy paste interaction simulation
            document.getElementById('key-input').value = "PHTM-82A6-D0C5-D56E";
        }

        function unlockPanel() {
            let key = document.getElementById('key-input').value;
            if(key.trim() !== "") {
                // Switch from Login to Home Dashboard
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('home-screen').classList.add('active');
                document.getElementById('page-title').innerText = "HOME";
            } else {
                alert("Please enter a valid access key!");
            }
        }

        function switchTab(tabName, element) {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

            // Show selected screen
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

            // Highlight nav button
            element.classList.add('active');
        }

        function logout() {
            // Return to login screen
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById('login-screen').classList.add('active');
            document.getElementById('page-title').innerText = "PHANTOM";
            document.getElementById('key-input').value = "";
            
            // Reset nav to home default visual
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelector('.nav-bar').children[0].classList.add('active');
        }
    </script>
</body>
</html>
