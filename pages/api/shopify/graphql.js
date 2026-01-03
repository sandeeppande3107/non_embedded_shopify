import { getToken } from '../../../lib/shopify';

export default async function handler(req, res) {
  const shop = req.query.shop;
  const token = getToken(shop);
  if (!token) return res.status(401).json({ error: 'No access token for shop' });

  const query = req.body.query;
  if (!query) return res.status(400).json({ error: 'Missing query body' });

  const resp = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const data = await resp.json();
  res.json(data);
}
