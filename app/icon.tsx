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
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ring" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFB347" />
              <stop offset="50%" stopColor="#F58220" />
              <stop offset="100%" stopColor="#D4691A" />
            </radialGradient>
          </defs>
          {/* Orange ring / donut */}
          <circle cx="16" cy="16" r="13" stroke="url(#ring)" strokeWidth="6.5" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
