const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'requests.log');

function customLogger(req, res, next) {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, logEntry, (err) => {
    // Fail silently, no console.log allowed
  });
  next();
}

module.exports = customLogger;
