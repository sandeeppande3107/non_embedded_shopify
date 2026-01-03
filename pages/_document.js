import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Aggressively override Next.js FOUC prevention */
            html, body {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            body {
              margin: 0;
              padding: 0;
            }
            /* Hide the FOUC prevention style tag itself */
            style[data-next-hide-fouc="true"] {
              display: none !important;
            }
            /* Override any inline styles on body */
            body[style*="display: none"] {
              display: block !important;
            }
          `
        }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Run immediately when script loads to remove FOUC prevention
              (function() {
                if (typeof document !== 'undefined') {
                  // Remove FOUC prevention style
                  const foucStyle = document.querySelector('style[data-next-hide-fouc="true"]');
                  if (foucStyle) {
                    foucStyle.remove();
                  }
                  // Force body to be visible
                  if (document.body) {
                    document.body.style.setProperty('display', 'block', 'important');
                    document.body.style.setProperty('visibility', 'visible', 'important');
                    document.body.style.setProperty('opacity', '1', 'important');
                  }
                }
              })();
            `,
          }}
        />
      </Head>
      <body style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

