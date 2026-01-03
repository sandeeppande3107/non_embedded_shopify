export default function Home({ isProxy, shop, queryParams }) {
  // If this is a proxy request, show proxy-specific content
  if (!isProxy) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
        <h1>Customer Dashboard (App Proxy)</h1>
        <p>This is being served through Shopify's app proxy.</p>
        {shop && <p><strong>Shop:</strong> {shop}</p>}
        {queryParams && Object.keys(queryParams).length > 0 && (
          <div>
            <p><strong>Query Parameters:</strong></p>
            <ul>
              {Object.entries(queryParams).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {String(value)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Regular home page
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Unified Non-Embedded Shopify App</h1>
      <p>This app runs outside Shopify (non-embedded).</p>
      <p>
        <a href="/admin">Admin Dashboard</a> · <a href="/customer">Customer Dashboard</a>
      </p>
      <a href="https://localhost:3000/api/auth?shop=dev-store-749237498237498330.myshopify.com">install</a>
      <p>To install the app, open: <code>/api/auth?shop=your-shop.myshopify.com</code></p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query, req } = context;

  // Log all requests to see if Shopify is hitting this endpoint
  console.log('=== Root Index Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(query, null, 2));
  console.log('Headers:', {
    'user-agent': req.headers['user-agent'],
    'host': req.headers['host'],
    'referer': req.headers['referer']
  });

  // Check if this is an app proxy request (has shop and signature params)
  const isProxy = !!(query.shop && (query.signature || query.hmac));

  return {
    props: {
      isProxy,
      shop: query.shop || null,
      queryParams: query || {}
    }
  };
}
