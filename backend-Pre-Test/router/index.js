// routes/index.js
import express from 'express';
import { logEvent } from '../middleware/logger.js';

const router = express.Router();

router.get('/test-error', async (req, res) => {
  await logEvent({
    stack: 'backend',
    level: 'error',
    pkg: 'controller',
    message: 'Test error triggered from backend'
  });

  res.send('Error log sent');
});

router.get('/test-success', async (req, res) => {
  await logEvent({
    stack: 'backend',
    level: 'info',
    pkg: 'controller',
    message: 'Success log from backend'
  });

  res.send('Success log sent');
});

export default router;
