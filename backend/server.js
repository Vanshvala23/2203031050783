const express = require('express');
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const customLogger = require('./logger');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(customLogger); // ✅ custom logger middleware

// In-memory storage
const urlDatabase = new Map();        // shortCode -> { originalUrl, expiryTime, createdAt, clicks: [] }
const reverseDatabase = new Map();    // originalUrl -> shortCode

function isValidHttpUrl(url) {
  return validUrl.isWebUri(url);
}

function isValidShortCode(code) {
  return /^[a-zA-Z0-9_-]{4,16}$/.test(code); // alphanumeric + _ -
}

// POST /shorten - Create a shortened URL
app.post('/shorten', (req, res) => {
  const { originalUrl, validity, shortCode } = req.body;

  // Validate input
  if (!originalUrl || !isValidHttpUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid original URL' });
  }

  let validityMinutes = parseInt(validity);
  if (isNaN(validityMinutes) || validityMinutes <= 0) {
    validityMinutes = 30; // Default: 30 minutes
  }

  // If URL already shortened & still valid
  if (reverseDatabase.has(originalUrl)) {
    const existingCode = reverseDatabase.get(originalUrl);
    const entry = urlDatabase.get(existingCode);

    if (new Date() < entry.expiryTime) {
      return res.status(200).json({
        message: 'Already shortened',
        shortUrl: `http://localhost:${PORT}/${existingCode}`,
        expiry: entry.expiryTime,
      });
    }

    // Remove expired entry
    urlDatabase.delete(existingCode);
    reverseDatabase.delete(originalUrl);
  }

  // Determine short code
  let code = shortCode;
  if (code) {
    if (!isValidShortCode(code)) {
      return res.status(400).json({ error: 'Invalid custom shortcode. Use 4–16 alphanumeric characters.' });
    }
    if (urlDatabase.has(code)) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }
  } else {
    do {
      code = nanoid(6);
    } while (urlDatabase.has(code));
  }

  const now = new Date();
  const expiryTime = new Date(now.getTime() + validityMinutes * 60000);

  urlDatabase.set(code, {
    originalUrl,
    expiryTime,
    createdAt: now,       // ✅ store creation time
    clicks: [],
  });
  reverseDatabase.set(originalUrl, code);

  return res.status(201).json({
    message: 'Short URL created successfully',
    shortUrl: `http://localhost:${PORT}/${code}`,
    expiry: expiryTime,
  });
});

app.get('/stats', (req, res) => {
  const stats = [];

  for (const [code, entry] of urlDatabase.entries()) {
    stats.push({
      shortCode: code,
      originalUrl: entry.originalUrl,
      createdAt: entry.createdAt,
      expiryTime: entry.expiryTime,
      clickCount: entry.clicks.length,
      clickTimestamps: entry.clicks,
    });
  }

  if (stats.length === 0) {
    return res.status(404).json({ error: 'No stats available. Possibly server restarted or no data.' });
  }

  res.status(200).json(stats);
});

// ✅ Shortcode redirect route must come after
app.get('/:shortCode', (req, res) => {
  const code = req.params.shortCode;
  const entry = urlDatabase.get(code);

  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  if (new Date() > entry.expiryTime) {
    urlDatabase.delete(code);
    reverseDatabase.delete(entry.originalUrl);
    return res.status(410).json({ error: 'Link expired' });
  }

  entry.clicks.push(new Date().toISOString());
  res.redirect(entry.originalUrl);
});

app.listen(PORT);
