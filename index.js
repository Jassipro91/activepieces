const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Root test
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Webhook verification (GET) - DrChrono sends ?msg=xxx, we sign it and return JSON
app.get('/webhook', (req, res) => {
  const msg = req.query.msg;
  console.log('Verification challenge received:', msg);

  const hashed = crypto
    .createHmac('sha256', process.env.DRCHRONO_SECRET_TOKEN)
    .update(msg)
    .digest('hex');

  console.log('Sending back hashed token:', hashed);
  res.status(200).json({ secret_token: hashed });
});

// Webhook events (POST) - Forward to Activepieces
app.post('/webhook', async (req, res) => {
  console.log('Event received:', req.body);

  try {
    await fetch('https://cloud.activepieces.com/api/v1/webhooks/3CMZmYudxo5xTeyEYiIOo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
  } catch (err) {
    console.error('Forward error:', err);
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
