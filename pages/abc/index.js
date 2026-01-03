export default function Admin({ shop, queryParams }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Admin Dashboard (Non-Embedded)</h1>
      <p>This page is NOT inside Shopify's iframe and does NOT use App Bridge.</p>
      {shop && <p><strong>Shop:</strong> {shop}</p>}
      {queryParams && Object.keys(queryParams).length > 0 && (
        <p><strong>Query Params:</strong> {Object.keys(queryParams).join(', ')}</p>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  // This ensures the page is server-rendered and works with app proxy
  const { query, req } = context;

  // Log all requests to see if Shopify is hitting this endpoint
  console.log('=== /abc Page Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Query:', JSON.stringify(query, null, 2));
  console.log('Headers:', {
    'user-agent': req.headers['user-agent'],
    'host': req.headers['host'],
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'referer': req.headers['referer']
  });

  return {
    props: {
      shop: query.shop || null,
      queryParams: query || {}
    }
  };
}
