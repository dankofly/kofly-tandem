import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 24,
          background: "linear-gradient(135deg, #FF8C00 0%, #F56300 50%, #E04D00 100%)",
        }}
      >
        <span
          style={{
            fontSize: 128,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-3px",
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
