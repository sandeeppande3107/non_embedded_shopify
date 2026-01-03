export const store = {};

export function saveToken(shop, token) {
  store[shop] = token;
}

export function getToken(shop) {
  return store[shop];
}
