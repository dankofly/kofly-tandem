import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 64,
          background: "linear-gradient(135deg, #FF8C00 0%, #F56300 50%, #E04D00 100%)",
        }}
      >
        <span
          style={{
            fontSize: 340,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-8px",
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
