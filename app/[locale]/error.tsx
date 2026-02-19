"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Ein Fehler ist aufgetreten</h2>
      <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
        {error.message}
      </pre>
      {error.digest && <p>Digest: {error.digest}</p>}
      <button onClick={() => reset()}>Erneut versuchen</button>
    </div>
  );
}
