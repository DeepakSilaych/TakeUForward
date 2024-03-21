// backend/app.js

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { DateTime } = require('luxon');

const app = express();
const PORT = process.env.PORT || 5000;

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    language TEXT,
    stdin TEXT,
    source_code TEXT,
    timestamp TEXT
  )`);
});


app.use(bodyParser.json());

app.post('/submit', (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;

  const timestamp = DateTime.now().toISO();

  const insertStmt = db.prepare(`INSERT INTO snippets (username, language, stdin, source_code, timestamp) 
                                 VALUES (?, ?, ?, ?, ?)`);
  
  insertStmt.run(username, language, stdin, sourceCode, timestamp, (err) => {
    if (err) {
      console.error('Error inserting snippet:', err);
      res.status(500).json({ error: 'Error inserting snippet' });
    } else {
      res.status(200).json({ message: 'Snippet submitted successfully' });
    }
  });
});

app.get('/snippets', (req, res) => {
  db.all(`SELECT id, username, language, stdin, substr(source_code, 1, 100) AS source_code_preview, timestamp 
          FROM snippets`, (err, rows) => {
    if (err) {
      console.error('Error fetching snippets:', err);
      res.status(500).json({ error: 'Error fetching snippets' });
    } else {
      res.status(200).json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
