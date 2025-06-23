// middleware/logger.js
const axios=require('axios');

export const logEvent = async ({ stack, level, pkg, message }) => {
  const payload = {
    stack,                // "backend" or "frontend"
    level,                // "error", "info", etc.
    package: pkg,         // "handler", "model", etc.
    message
  };

  try {
    const res = await axios.post(
      'http://10.0.2.196:3004/medcall-core-service/logs',
      payload
    );
    console.log('Log Result:', res.data.message);
  } catch (err) {
    console.error('Logging Error:', err.message);
  }
};

export const loggerMiddleware = (req, res, next) => {
  logEvent({
    stack: 'backend',
    level: 'info',
    pkg: 'router',
    message: `Request to ${req.path}`
  });

  next();
};
