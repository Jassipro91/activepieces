const express = require('express');
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

// ✅ Webhook verification (GET)
app.get('/webhook', (req, res) => {
  const msg = req.query.msg;

  console.log('Verification:', msg);

  res.set('Content-Type', 'text/plain');
  res.status(200).send(msg);
});

// ✅ Webhook events (POST)
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

// ✅ IMPORTANT: PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
