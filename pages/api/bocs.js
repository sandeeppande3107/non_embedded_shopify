/**
 * /api/bocs
 *
 * Reachable from the storefront via the App Proxy at:
 *   https://{shop}.myshopify.com/apps/customer-dashboard/api/bocs
 *
 * Shopify appends query params automatically:
 *   shop, path_prefix, timestamp, signature, logged_in_customer_id
 *
 * Proxies to the BOCS backend endpoint and returns the store's BOCS plans.
 */

const BOCS_API_URL =
  process.env.NEXT_PUBLIC_ASSET_PREFIX || process.env.BOCS_API_URL || 'http://localhost:4014';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Forward all Shopify-injected query params to the backend
  const queryString = new URLSearchParams(req.query).toString();
  const upstreamUrl = `${BOCS_API_URL}/customer-portal/store/bocs${
    queryString ? `?${queryString}` : ''
  }`;

  console.log('=== GET /api/bocs ===');
  console.log('Upstream URL:', upstreamUrl);
  console.log('Query params:', JSON.stringify(req.query, null, 2));

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await upstream.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error('/api/bocs upstream error:', err.message);
    return res.status(502).json({ error: 'Failed to reach BOCS API', detail: err.message });
  }
}
