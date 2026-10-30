const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'drake_panel.db');
const db = new Database(dbPath);

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

module.exports = { db, getDeviceInfo };
