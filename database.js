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
      device TEXT DEFAULT 'Unbound',
      platform TEXT DEFAULT 'Unknown',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
} catch (err) {
  console.error("DB Setup Error:", err);
}

// Device detection helper
const getDeviceInfo = (userAgent) => {
  if (/android/i.test(userAgent)) {
    let match = userAgent.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      let parts = match[1].split(';');
      let deviceModel = parts[parts.length - 1].trim();
      return { name: deviceModel || 'Android Device', os: 'Android' };
    }
    return { name: 'Android Device', os: 'Android' };
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return { name: 'iPhone / iOS Device', os: 'iOS' };
  } else if (/windows/i.test(userAgent)) {
    return { name: 'Windows PC', os: 'Windows' };
  }
  return { name: 'Web Browser', os: 'Unknown' };
};

module.exports = { db, getDeviceInfo };

