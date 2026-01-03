import { render } from '@shopify/customer-account-ui-extensions-react';

const renderExtension = (root, api) => {
  const { idToken } = api.session;

  const a = document.createElement('a');
  a.href = `https://mas-eggs-zone-listings.trycloudflare.com/customer?token=${encodeURIComponent(idToken)}`;
  a.innerText = 'Open Customer Dashboard';
  a.style.display = 'inline-block';
  a.style.padding = '6px 10px';
  a.style.border = '1px solid #444';
  a.style.borderRadius = '4px';
  a.style.textDecoration = 'none';
  a.style.color = '#111';

  root.appendChild(a);
};

render('customer-account.order.action.render', renderExtension);
render('customer-account.order.action.menu-item.render', renderExtension);
