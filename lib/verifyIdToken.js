import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://shopify.dev/customer-accounts/jwks')
);

export async function verifyIdToken(idToken) {
  const { payload } = await jwtVerify(idToken, JWKS);
  return payload;
}
