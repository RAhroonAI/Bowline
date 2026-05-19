import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 22,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 500,
          letterSpacing: -1,
        }}
      >
        S
      </div>
    ),
    size
  );
}
