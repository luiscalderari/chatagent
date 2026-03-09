const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  // AI Configuration table
  db.run(`CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    openai_key TEXT,
    training_data TEXT,
    evolution_api_url TEXT,
    evolution_api_key TEXT,
    evolution_instance_name TEXT
  )`);

  // Insert default config if not exists
  db.run(`INSERT OR IGNORE INTO config (id) VALUES (1)`);
});

module.exports = db;
