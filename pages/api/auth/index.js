import crypto from "crypto";

export default function handler(req, res) {
  console.log("req.query", req.query);
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop parameter");

  const state = crypto.randomBytes(12).toString("hex");
  const redirectUri = `${process.env.APP_URL}/api/auth/callback`;

  const url =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_API_KEY}` +
    `&scope=${process.env.SHOPIFY_SCOPES}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  res.redirect(url);
}
