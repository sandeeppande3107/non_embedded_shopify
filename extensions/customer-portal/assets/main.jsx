import { render } from '@shopify/customer-account-ui-extensions-react';

const BASE_URL = process.env.NEXT_PUBLIC_ASSET_PREFIX || 'https://mas-eggs-zone-listings.trycloudflare.com';

// ── Shared: order action button (compact) ────────────────────────────
const renderOrderAction = (root, api) => {
  const { idToken } = api.session;

  const a = document.createElement('a');
  a.href = `${BASE_URL}/customer?token=${encodeURIComponent(idToken)}`;
  a.innerText = 'Open Customer Dashboard';
  a.style.display = 'inline-block';
  a.style.padding = '6px 10px';
  a.style.border = '1px solid #444';
  a.style.borderRadius = '4px';
  a.style.textDecoration = 'none';
  a.style.color = '#111';
  a.style.fontSize = 'clamp(0.875rem, 1.5vw, 1rem)';

  root.appendChild(a);
};

// ── Profile page block (prominent card) ─────────────────────────────
const renderProfileBlock = (root, api) => {
  const { idToken } = api.session;
  const dashUrl = `${BASE_URL}/customer?token=${encodeURIComponent(idToken)}`;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    padding: 20px 24px;
    border: 1px solid #e0d8cc;
    background: #f5f0ea;
    font-family: Georgia, serif;
  `;

  const heading = document.createElement('p');
  heading.innerText = 'MANAGE SUBSCRIPTIONS';
  heading.style.cssText = `
    font-size: clamp(0.85rem, 1.5vw, 1rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #777;
    margin: 0 0 6px;
  `;

  const sub = document.createElement('p');
  sub.innerText = 'View and manage your subscription boxes, delivery frequency, and billing.';
  sub.style.cssText = `
    font-size: clamp(1rem, 2vw, 1.125rem);
    color: #555;
    font-style: italic;
    margin: 0 0 16px;
    line-height: 1.5;
  `;

  const btn = document.createElement('a');
  btn.href = dashUrl;
  btn.innerText = 'Open Customer Dashboard ›';
  btn.style.cssText = `
    display: inline-block;
    padding: 10px 24px;
    background: #5c4a3a;
    color: #fff;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    font-family: Georgia, serif;
  `;

  wrapper.appendChild(heading);
  wrapper.appendChild(sub);
  wrapper.appendChild(btn);
  root.appendChild(wrapper);
};

render('customer-account.order.action.render', renderOrderAction);
render('customer-account.order.action.menu-item.render', renderOrderAction);
render('customer-account.profile.block.render', renderProfileBlock);
