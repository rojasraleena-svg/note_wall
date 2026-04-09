import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
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
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
        }}
      >
        {/* Note shape */}
        <div
          style={{
            width: "28px",
            height: "32px",
            backgroundColor: "white",
            borderRadius: "4px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            padding: "5px 4px",
          }}
        >
          {/* Text lines */}
          <div
            style={{ height: "3px", borderRadius: "1.5px", background: "#c7d2fe", width: "80%", opacity: 0.8 }}
          />
          <div
            style={{ height: "3px", borderRadius: "1.5px", background: "#e0e7ff", width: "60%", opacity: 0.6 }}
          />
          <div
            style={{ height: "3px", borderRadius: "1.5px", background: "#e0e7ff", width: "40%", opacity: 0.4 }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
