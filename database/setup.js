const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.dirname(process.env.DB_PATH || './database/ai_company.db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(process.env.DB_PATH || './database/ai_company.db');

// Create tables
db.serialize(() => {
  // Ideas table
  db.run(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      potential_revenue TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Research table
  db.run(`
    CREATE TABLE IF NOT EXISTS research (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER,
      research_data TEXT,
      competitor_analysis TEXT,
      market_opportunity TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idea_id) REFERENCES ideas (id)
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER,
      product_name TEXT,
      product_description TEXT,
      features TEXT,
      target_market TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idea_id) REFERENCES ideas (id)
    )
  `);

  // Token holder votes
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token_holder_id TEXT,
      item_type TEXT, -- 'idea', 'product', 'research'
      item_id INTEGER,
      vote TEXT, -- 'approve', 'reject'
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Agent activities log
  db.run(`
    CREATE TABLE IF NOT EXISTS agent_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_name TEXT,
      activity TEXT,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

console.log('Database initialized successfully');

module.exports = db;
