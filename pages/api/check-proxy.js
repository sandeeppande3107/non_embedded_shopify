// API route to check current app proxy configuration
// This uses the Shopify Admin API to query the current app proxy settings
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Note: Shopify Admin API doesn't support querying appProxy directly
  // App proxy configuration is managed via mutations (appProxyCreate/appProxyUpdate)
  // and can be viewed in the Partner Dashboard
  // This endpoint will return the configuration from shopify.app.toml instead
  const query = `
    query {
      app {
        id
        title
        apiVersion
      }
    }
  `;

  // This requires an admin access token
  // You'll need to get this from your app's OAuth session
  const adminAccessToken = req.query.token;
  
  if (!adminAccessToken) {
    return res.status(400).json({ 
      error: "Admin access token required",
      instructions: "Add ?token=YOUR_ADMIN_ACCESS_TOKEN to the URL"
    });
  }

  try {
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN || "dev-store-749237498237498330.myshopify.com";
    const response = await fetch(`https://${shopDomain}/admin/api/2025-01/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": adminAccessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    // App proxy cannot be queried via GraphQL
    // Return the expected configuration from shopify.app.toml instead
    return res.status(200).json({ 
      message: "App proxy cannot be queried via GraphQL API",
      note: "App proxy configuration is defined in shopify.app.toml and can be viewed in Partner Dashboard",
      expectedConfig: {
        subPath: "customer-dashboard",
        subPathPrefix: "apps",
        proxyUrl: `${process.env.SHOPIFY_APP_URL || 'https://mas-eggs-zone-listings.trycloudflare.com'}/api/proxy`
      },
      appInfo: data.data?.app || null,
      rawResponse: data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

