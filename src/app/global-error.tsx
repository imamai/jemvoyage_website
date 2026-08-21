"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches failures in the root layout itself, where the
 * site chrome and theme are unavailable. It must render its own <html> and
 * <body>, and cannot rely on the design system, so the styling here is
 * deliberately inline and self-contained.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[jemvoyage] global error", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF9F5",
          color: "#171512",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#A06E2F",
              margin: 0,
            }}
          >
            Jemvoyage
          </p>
          <h1
            style={{
              fontSize: "1.875rem",
              lineHeight: 1.15,
              margin: "1rem 0 0",
              fontWeight: 500,
              color: "#1E3A32",
            }}
          >
            We hit an unexpected problem
          </h1>
          <p style={{ margin: "1rem 0 0", lineHeight: 1.7, color: "#6B6357" }}>
            Please reload the page. If this keeps happening, contact us and quote
            the reference below.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              height: "3rem",
              padding: "0 2rem",
              border: "none",
              borderRadius: "4px",
              background: "#1E3A32",
              color: "#FBF9F5",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error.digest ? (
            <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "#9A8C76" }}>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
