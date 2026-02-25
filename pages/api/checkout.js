/**
 * /api/checkout
 *
 * Reachable from the storefront via the App Proxy at:
 *   https://{shop}.myshopify.com/apps/customer-dashboard/api/checkout
 *
 * Shopify appends query params automatically:
 *   shop, path_prefix, timestamp, signature, logged_in_customer_id
 *
 * Proxies the subscribe POST to the BOCS backend and returns
 * the checkout URL for redirect.
 *
 * Request body:
 *   { items: [{ variantId, sellingPlanId, quantity }] }
 *
 * Response:
 *   { code: 200, message: "success", data: { checkoutUrl: "https://..." } }
 */

const BOCS_API_URL =
  process.env.NEXT_PUBLIC_ASSET_PREFIX || process.env.BOCS_API_URL || 'http://localhost:4014';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // Forward all Shopify-injected query params to the backend
  const queryString = new URLSearchParams(req.query).toString();
  const upstreamUrl = `${BOCS_API_URL}/customer-portal/store/checkout${
    queryString ? `?${queryString}` : ''
  }`;

  console.log('=== POST /api/checkout ===');
  console.log('Upstream URL:', upstreamUrl);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error('/api/checkout upstream error:', err.message);
    return res.status(502).json({ error: 'Failed to reach BOCS API', detail: err.message });
  }
}
