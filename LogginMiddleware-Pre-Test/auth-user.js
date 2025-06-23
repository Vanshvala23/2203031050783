const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5002;

app.use(express.json());

app.post('/authenticate-user', async (req, res) => {
  try {
    const {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret
    } = req.body;

    if (!email || !name || !rollNo || !accessCode || !clientID || !clientSecret) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret
    });

    res.status(200).json({
      message: 'Authentication successful!',
      token_type: response.data.token_type,
      access_token: response.data.access_token,
      expires_in: response.data.expires_in
    });
  } catch (error) {
    const msg = error.response?.data || error.message;
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Auth service running at http://localhost:${PORT}`);
});
