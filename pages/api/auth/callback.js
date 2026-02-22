import axios from "axios";
import { saveToken } from "../../../lib/shopify";

export default async function handler(req, res) {
  console.log("req.query", req.query);
  const { shop, code } = req.query;
  if (!shop || !code)
    return res.status(400).json({ error: "Missing shop or code" });

  try {
    const resp = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const { access_token } = resp.data;
    console.log("access_token", access_token);
    saveToken(shop, access_token);

    // Redirect to your admin dashboard (non-embedded)
    res.redirect(`/admin?shop=${encodeURIComponent(shop)}`);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "OAuth failed", details: e.message });
  }
}
