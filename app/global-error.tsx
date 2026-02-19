"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h2>Globaler Fehler</h2>
        <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
          {error.message}
        </pre>
        {error.digest && <p>Digest: {error.digest}</p>}
        <button onClick={() => reset()}>Erneut versuchen</button>
      </body>
    </html>
  );
}
