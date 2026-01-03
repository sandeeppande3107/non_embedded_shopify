// API route to check app proxy configuration
// Note: App proxy cannot be created/updated via Admin API
// App proxy is managed through shopify.app.toml and deployed via Shopify CLI

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const appUrl = process.env.SHOPIFY_APP_URL || process.env.APP_URL || 'https://mas-eggs-zone-listings.trycloudflare.com';

  // Return the configuration from shopify.app.toml
  return res.status(200).json({
    message: "App proxy is configured in shopify.app.toml",
    note: "App proxy cannot be created/updated via Admin API. It must be configured in shopify.app.toml and deployed via Shopify CLI.",
    currentConfig: {
      url: "/api/proxy",
      prefix: "apps",
      subpath: "customer-dashboard",
      fullUrl: `${appUrl}/api/proxy`,
      proxyPath: `https://YOUR_SHOP.myshopify.com/apps/customer-dashboard`
    },
    instructions: [
      "1. App proxy is already configured in shopify.app.toml",
      "2. Deploy your app using: shopify app deploy",
      "3. The app proxy will be automatically configured during deployment",
      "4. You can view/manage app proxy in Shopify Partner Dashboard → Your App → App Proxy"
    ],
    shopifyAppToml: {
      "[app_proxy]": {
        url: "/api/proxy",
        prefix: "apps",
        subpath: "customer-dashboard"
      }
    }
  });
}

