// server.js
const express=require('express');
const router=require('./routes');
const loggerMiddleware=require('./middleware/loggerMiddleware');

const app = express();

app.use(express.json());
app.use(loggerMiddleware);  // Apply logging to all requests
app.use('/', router);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
