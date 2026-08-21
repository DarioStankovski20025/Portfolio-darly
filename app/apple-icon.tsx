import { ImageResponse } from "next/og";

/**
 * The home-screen icon on iOS.
 *
 * Two differences from `icon.tsx`, both forced by how iOS treats it. There is
 * real interior padding, because iOS masks the image into a squircle and shaves
 * anything sitting near the corners. And the background is fully opaque —
 * transparency gets composited onto black, which would make the mark
 * unreadable on a light home screen.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "Darly";

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
          gap: 10,
          padding: 16,
          backgroundColor: "#07111f",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 600,
            letterSpacing: -6,
            lineHeight: 1,
            color: "#f5f7fa",
          }}
        >
          d
        </div>
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            marginTop: 46,
            backgroundColor: "#55b8ff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
