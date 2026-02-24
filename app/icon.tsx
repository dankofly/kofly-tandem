import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          background: "linear-gradient(135deg, #FF8C00 0%, #F56300 50%, #E04D00 100%)",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
