const express = require('express');
const Database = require('better-sqlite3');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and body parser setup
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new Database('drake_panel.db');
db.prepare(`
  CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_code TEXT UNIQUE,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Dashboard HTML + CSS Interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Drake Panel Dashboard</title>
        <style>
            :root { bg: #0f172a; card: #1e293b; primary: #38bdf8; text: #f8fafc; }
            body { background: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { text-align: center; color: #38bdf8; margin-bottom: 5px; }
            .subtitle { text-align: center; color: #94a3b8; font-size: 0.9rem; margin-bottom: 25px; }
            .card { background: #1e293b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); margin-bottom: 20px; }
            input, button { width: 100%; padding: 12px; margin-top: 10px; border-radius: 8px; border: none; font-size: 1rem; box-sizing: border-box; }
            input { background: #0f172a; color: #fff; border: 1px solid #334155; }
            button { background: #38bdf8; color: #0f172a; font-weight: bold; cursor: pointer; transition: 0.2s; }
            button:hover { background: #0ea5e9; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #334155; font-size: 0.9rem; }
            th { color: #38bdf8; }
            .badge { background: #065f46; color: #34d399; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Drake Panel 🚀</h1>
            <div class="subtitle">Mobile Control & Key Management System</div>
            
            <div class="card">
                <h3>Generate New Key</h3>
                <form action="/generate" method="POST">
                    <input type="text" name="key_code" placeholder="Enter Key Code (e.g., PHTM-XXXX)" required>
                    <button type="submit">Create Key</button>
                </form>
            </div>

            <div class="card">
                <h3>Active Keys List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Key Code</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="keyTable">
                        <!-- Data will be loaded via script or template -->
                    </tbody>
                </table>
            </div>
        </div>

        <script>
            async function fetchKeys() {
                const res = await fetch('/api/keys');
                const data = await res.json();
                const tbody = document.getElementById('keyTable');
                tbody.innerHTML = '';
                data.forEach(k => {
                    tbody.innerHTML += \`<tr><td>\${k.key_code}</td><td><span class="badge">\${k.status}</span></td></tr>\`;
                });
            }
            fetchKeys();
        </script>
    </body>
    </html>
  `);
});

// API to get keys
app.get('/api/keys', (req, res) => {
  const rows = db.prepare('SELECT * FROM keys ORDER BY id DESC').all();
  res.json(rows);
});

// API to generate key
app.post('/generate', (req, res) => {
  const { key_code } = req.body;
  if (key_code) {
    try {
      db.prepare('INSERT INTO keys (key_code) VALUES (?)').run(key_code);
    } catch (e) {
      console.log('Key already exists or error');
    }
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Drake Panel server running on port \${PORT}`);
});
