# Non-Embedded Shopify App (Next.js) + Customer Portal Extension

This repository contains:

- Non-embedded Next.js Page Router app (OAuth, Admin pages, Customer dashboard)
- Customer Account UI Extension (bundle) ready for Shopify CLI deployment

## Local dev

1. Copy `.env.example` -> `.env.local` and fill values.
2. Run Next.js app:
   ```
   npm install
   npm run dev
   ```
3. Use Shopify CLI to serve and deploy extensions:
   - `npx shopify app dev` (from repo root) to run local dev for extensions + app.

## Notes

- Tokens are stored in-memory in lib/shopify.js (replace with DB in production).
- Extension assets are in `extensions/customer-portal`.

# non_embedded_shopify

cloudflared tunnel --url http://localhost:3005
