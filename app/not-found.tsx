import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "8rem",
                fontWeight: 900,
                lineHeight: 1,
                opacity: 0.15,
                margin: 0,
              }}
            >
              404
            </p>
            <h1 style={{ marginTop: "-1rem", fontSize: "2rem", fontWeight: 900 }}>
              Turbulenz erwischt!
            </h1>
            <p style={{ color: "#666", marginTop: "0.5rem" }}>
              Diese Seite hat leider keine sanfte Landung hingelegt.
            </p>
            <Link
              href="/de"
              style={{
                display: "inline-block",
                marginTop: "2rem",
                padding: "0.75rem 1.5rem",
                background: "#e85d04",
                color: "#fff",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Zur Startseite fliegen
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}
