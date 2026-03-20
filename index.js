const express = require('express');
const app = express();

app.use(express.json());

// ✅ 1. VERIFICATION (GET request from DrChrono)
app.get('/webhook', (req, res) => {
  const msg = req.query.msg;

  console.log('Verification request received:', msg);

  res.set('Content-Type', 'text/plain');
  res.status(200).send(msg); // MUST return exact msg
});

// ✅ 2. EVENTS (POST from DrChrono)
app.post('/webhook', async (req, res) => {
  console.log('Incoming DrChrono Event:', req.body);

  try {
    await fetch('https://cloud.activepieces.com/api/v1/webhooks/3CMZmYudxo5xTeyEYiIOo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    console.log('Forwarded to Activepieces successfully');

  } catch (error) {
    console.error('Error forwarding to Activepieces:', error);
  }

  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
