import crypto from 'crypto';

const SECRET = process.env.SHOPIFY_API_SECRET;

function validateHmac(query) {
  if (!SECRET) {
    console.error('SHOPIFY_API_SECRET is not set');
    return false;
  }

  // Shopify app proxy uses 'signature' not 'hmac'
  const { signature, hmac, ...rest } = query;
  const providedSignature = signature || hmac; // Support both for compatibility

  if (!providedSignature) {
    console.error('Signature/HMAC parameter missing from query');
    return false;
  }

  const message = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('&');

  const digest = crypto.createHmac('sha256', SECRET).update(message).digest('hex');
  const isValid = digest === providedSignature;

  if (!isValid) {
    console.error('Signature validation failed', {
      expected: digest,
      received: providedSignature,
      message: message.substring(0, 200) // Log first 200 chars
    });
  }

  return isValid;
}

export default function handler(req, res) {
  // Log all incoming requests for debugging
  console.log('=== App Proxy Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Headers:', {
    'user-agent': req.headers['user-agent'],
    'host': req.headers['host'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'referer': req.headers['referer']
  });

  // Immediate response test - if this doesn't work, there's a routing issue
  if (req.query.test === 'simple') {
    return res.status(200).json({ message: 'Proxy endpoint is working!', timestamp: new Date().toISOString() });
  }

  // Check if this is a GET, POST, or HEAD request (app proxy typically uses GET, HEAD for health checks)
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'HEAD') {
    console.error('Invalid method:', req.method);
    // Return HTML error instead of JSON for app proxy
    res.setHeader('Content-Type', 'text/html');
    return res.status(405).send(`
      <html><body><h1>405 Method Not Allowed</h1><p>Method: ${req.method}</p></body></html>
    `);
  }

  // Handle HEAD requests (health checks) - return 200 with no body
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  // Validate signature (Shopify app proxy uses 'signature' not 'hmac')
  const signatureValid = validateHmac(req.query);
  console.log('Signature validation result:', signatureValid);
  console.log('Signature from query:', req.query.signature ? 'present' : 'missing');
  console.log('HMAC from query (legacy):', req.query.hmac ? 'present' : 'missing');
  console.log('All query params:', Object.keys(req.query));

  // Even if signature fails, return HTML (not JSON) so Shopify doesn't show 404
  if (!signatureValid) {
    console.error('Signature validation failed - returning error page');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Authentication Error</title></head>
      <body>
        <h1>Authentication Error</h1>
        <p>Signature validation failed. Check server logs for details.</p>
        <p>Received params: ${Object.keys(req.query).join(', ')}</p>
      </body>
      </html>
    `);
  }

  // Success - log and respond
  console.log('HMAC validation passed');
  console.log('Shop:', req.query.shop);

  // Return HTML for customer-facing page
  // You can redirect to your customer page or render HTML directly
  const shop = req.query.shop;
  const customerToken = req.query.token; // If you pass a token

  // Option 1: Redirect to your customer page
  // res.redirect(`/customer?shop=${encodeURIComponent(shop)}${customerToken ? `&token=${encodeURIComponent(customerToken)}` : ''}`);

  // Option 2: Return HTML directly (better for app proxy)
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Customer Dashboard</title>
      <style>
        /* Ensure body is visible - override any Shopify proxy wrapper styles */
        html, body {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          margin-top: 0;
        }
        .info {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .success {
          color: #28a745;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Customer Dashboard</h1>
        <div class="info">
          <p class="success">✓ App proxy is working correctly!</p>
          <p><strong>Shop:</strong> ${shop}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        <p>This is your customer dashboard. You can customize this page to show customer-specific content.</p>
        <p>To redirect to your Next.js customer page, uncomment the redirect line in the proxy.js file.</p>
      </div>
    </body>
    </html>
  `);
}
