const express = require('express');
const app = express();

// If Node version < 18, uncomment next line and install node-fetch
// const fetch = require('node-fetch');

app.use(express.json());

// ✅ Root route (for testing)
app.get('/', (req, res) => {
  res.send('Server is working');
});

// ✅ Health check (Render uses this)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ 🔥 FINAL BULLETPROOF VERIFICATION FIX
app.get('/webhook', (req, res) => {
  const msg = (req.query.msg || '').trim();

  console.log('Verification:', msg);

  const response = Buffer.from(msg, 'utf-8');

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': response.length,
    'Connection': 'close'
  });

  res.end(response);
});

// ✅ Handle actual events (POST)
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

// ✅ IMPORTANT: Render port handling
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
