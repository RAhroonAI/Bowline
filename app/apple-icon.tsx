import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F2",
          color: "#1E3A5F",
          fontSize: 110,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          letterSpacing: -4,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            width: 56,
            height: 3,
            borderRadius: 2,
            background: "#C8694A",
          }}
        />
        B
      </div>
    ),
    size
  );
}
