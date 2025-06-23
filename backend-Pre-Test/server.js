// server.js
import express from 'express';
import { loggerMiddleware } from './middleware/logger.js';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);  // Apply logging to all requests
app.use('/', router);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
