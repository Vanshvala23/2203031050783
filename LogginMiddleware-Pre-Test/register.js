const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 5001;

app.use(express.json()); // to parse JSON bodies

app.post('/register-user', async (req, res) => {
  try {
    const {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      collegeName,
      accessCode
    } = req.body;

    if (!email || !name || !mobileNo || !githubUsername || !rollNo || !collegeName || !accessCode) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      collegeName,
      accessCode
    });

    res.status(200).json({
      message: 'Registration successful!',
      email:response.data.email,
      name: response.data.name,
      rollNo: response.data.rollNo,
      accessCode: response.data.accessCode,
      clientID: response.data.clientID,
      clientSecret: response.data.clientSecret
    });
  } catch (error) {
    const msg = error.response?.data || error.message;
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
