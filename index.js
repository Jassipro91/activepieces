const express = require('express');
const app = express();

// If Node < 18, uncomment below and install node-fetch
// const fetch = require('node-fetch');

app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Server is working');
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ 🔥 FINAL DrChrono verification (STRICT RESPONSE)
app.get('/webhook', (req, res) => {
  const msg = (req.query.msg || '').trim();

  console.log('Verification:', msg);

  // Set exact headers manually
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(msg));
  res.setHeader('Connection', 'close');

  // Send exact response
  res.statusCode = 200;
  res.end(msg);
});

// ✅ Handle POST events (PING + real events)
app.post('/webhook', async (req, res) => {
  console.log('Event received:', req.body);

  try {
    await fetch('https://cloud.activepieces.com/api/v1/webhooks/3CMZmYudxo5xTeyEYiIOo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
  } catch (error) {
    console.error('Forward error:', error);
  }

  res.status(200).send('OK');
});

// ✅ Render port handling
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
