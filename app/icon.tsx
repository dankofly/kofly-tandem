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
          {/* Rays */}
          <g stroke="#e86830" strokeWidth="2" strokeLinecap="round">
            <line x1="16" y1="1" x2="16" y2="5" />
            <line x1="16" y1="27" x2="16" y2="31" />
            <line x1="1" y1="16" x2="5" y2="16" />
            <line x1="27" y1="16" x2="31" y2="16" />
            <line x1="5.4" y1="5.4" x2="8.2" y2="8.2" />
            <line x1="23.8" y1="23.8" x2="26.6" y2="26.6" />
            <line x1="5.4" y1="26.6" x2="8.2" y2="23.8" />
            <line x1="23.8" y1="8.2" x2="26.6" y2="5.4" />
          </g>
          {/* Sun circle */}
          <circle cx="16" cy="16" r="8" fill="#e86830" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
