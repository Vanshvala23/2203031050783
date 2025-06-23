
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'requests.log');

function customLogger(req, res, next) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
  fs.appendFile(logFile, log, (err) => {
    if (err) {
    }
  });
  next();
}

module.exports = customLogger;
