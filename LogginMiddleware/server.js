const express = require('express');
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const customLogger = require('./logger');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(customLogger); 

const urlDatabase = new Map(); 
const reverseDatabase = new Map(); 

function isValidHttpUrl(url) {
  return validUrl.isWebUri(url);
}

function isValidShortCode(code) {
  return /^[a-zA-Z0-9_-]{4,16}$/.test(code);
}

app.post('/shorten', (req, res) => {
  const { originalUrl, validity, shortCode } = req.body;

  if (!originalUrl || !isValidHttpUrl(originalUrl)) {
    return res.status(400).json({ error: 'Invalid or missing original URL' });
  }

  let validityMinutes = parseInt(validity);
  if (isNaN(validityMinutes) || validityMinutes <= 0) {
    validityMinutes = 30;
  }

  if (reverseDatabase.has(originalUrl)) {
    const existingCode = reverseDatabase.get(originalUrl);
    const existingEntry = urlDatabase.get(existingCode);

    if (new Date() < existingEntry.expiryTime) {
      return res.status(200).json({
        shortUrl: `http://localhost:${PORT}/${existingCode}`,
        expiry: existingEntry.expiryTime,
      });
    } else {
      urlDatabase.delete(existingCode);
      reverseDatabase.delete(originalUrl);
    }
  }

  let code = shortCode;
  if (code) {
    if (!isValidShortCode(code)) {
      return res.status(400).json({ error: 'Invalid custom shortcode. Use 4-16 alphanumeric characters.' });
    }
    if (urlDatabase.has(code)) {
      return res.status(409).json({ error: 'Custom shortcode already in use.' });
    }
  } else {
    do {
      code = nanoid(6);
    } while (urlDatabase.has(code));
  }

  const expiryTime = new Date(Date.now() + validityMinutes * 60 * 1000);

  urlDatabase.set(code, { originalUrl, expiryTime });
  reverseDatabase.set(originalUrl, code);

  return res.status(201).json({
    shortUrl: `http://localhost:${PORT}/${code}`,
    expiry: expiryTime,
  });
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  if (!urlDatabase.has(shortCode)) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const entry = urlDatabase.get(shortCode);

  if (new Date() > entry.expiryTime) {
    urlDatabase.delete(shortCode);
    reverseDatabase.delete(entry.originalUrl);
    return res.status(410).json({ error: 'Short URL has expired' });
  }

  res.redirect(entry.originalUrl);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT);
