/**
 * /api/hero
 *
 * Reachable from the storefront via the App Proxy at:
 *   https://{shop}.myshopify.com/apps/customer-dashboard/api/hero
 *
 * Shopify forwards the request and appends query params:
 *   shop, path_prefix, timestamp, signature
 *
 * GET  — logs query params, returns hero banner data
 * POST — logs query params + request body, returns hero banner data
 */

const HERO_DATA = {
  title: 'Summer Collection 2026',
  subtitle: 'Discover our freshest arrivals, handpicked just for you.',
  cta_text: 'Shop Now',
  cta_url: '/collections/all',
  bg_color: '#1a1a2e',
};

export default function handler(req, res) {
  const { method, query, body } = req;

  if (method === 'GET') {
    console.log('=== GET /api/hero ===');
    console.log('Query params:', JSON.stringify(query, null, 2));

    return res.status(200).json(HERO_DATA);
  }

  if (method === 'POST') {
    console.log('=== POST /api/hero ===');
    console.log('Query params:', JSON.stringify(query, null, 2));
    console.log('Request body:', JSON.stringify(body, null, 2));

    return res.status(200).json(HERO_DATA);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${method} not allowed` });
}
