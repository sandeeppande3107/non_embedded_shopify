import { verifyIdToken } from '../../lib/verifyIdToken';

export default function Customer({ customer, error }) {
  return (
    <div style={{fontFamily: 'Arial, sans-serif', padding: 20}}>
      <h1>Customer Dashboard</h1>
      {error ? <div style={{color:'red'}}>{error}</div> : (
        <>
          <p>Email: {customer?.email}</p>
          <p>ID: {customer?.id}</p>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const token = query.token;
  if (!token) {
    return { props: { customer: null, error: 'Missing token' } };
  }

  try {
    const payload = await verifyIdToken(token);
    return { props: { customer: payload.customer || null } };
  } catch (e) {
    return { props: { customer: null, error: 'Invalid token: ' + e.message } };
  }
}
