import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Darly — Digital Design & Development Agency";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070b0f",
          color: "#f5f7fa",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: "#55b8ff",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(244,246,245,0.6)",
            }}
          >
            Independent digital agency
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 148,
              letterSpacing: -7,
              lineHeight: 1,
            }}
          >
            darly
            <span style={{ color: "#55b8ff" }}>.</span>
          </div>
          <div
            style={{
              fontSize: 40,
              letterSpacing: -1.4,
              lineHeight: 1.25,
              maxWidth: 900,
              color: "rgba(244,246,245,0.78)",
            }}
          >
            We design digital products people remember.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(244,246,245,0.5)",
            borderTop: "1px solid rgba(244,246,245,0.16)",
            paddingTop: 26,
          }}
        >
          <div>Strategy · Design · Engineering</div>
          <div>darly.agency</div>
        </div>
      </div>
    ),
    size,
  );
}
