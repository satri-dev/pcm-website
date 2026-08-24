import Script from "next/script";

export default function AnalyticsTracker() {
  return (
    <Script id="site-analytics" strategy="afterInteractive">
      {`
        (() => {
          const SESSION_KEY = "analytics_session_started";
          const SESSION_DURATION = 30 * 60 * 1000;

          const now = Date.now();
          const lastVisit = Number(
            sessionStorage.getItem(SESSION_KEY) || 0
          );

          if (
            lastVisit &&
            now - lastVisit < SESSION_DURATION
          ) {
            return;
          }

          sessionStorage.setItem(
            SESSION_KEY,
            String(now)
          );

          fetch("/api/admin/analytics/visit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            keepalive: true,
            body: JSON.stringify({
              path: window.location.pathname,
              referrer: document.referrer || null
            })
          }).catch(() => {
            // Analytics should never break the website.
          });
        })();
      `}
    </Script>
  );
}
