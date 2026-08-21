import { ImageResponse } from "next/og";

/**
 * The tab icon: the darly "d" with its accent dot.
 *
 * Generated rather than shipped as a file. The only mark in the repo was a
 * 24×24 PNG — smaller than the 32px slot it would have to fill, so it could
 * only ever have been upscaled. This renders sharp at whatever size a browser
 * asks for.
 *
 * Two things are deliberate at this size. There is no border radius: browsers
 * round tab favicons themselves, and a pre-rounded PNG reads as a dent in the
 * corner against a dark tab strip. And the dot is 6px — about a fifth of the
 * width — because anything smaller disappears entirely at 32px, which is the
 * only size that actually matters here.
 *
 * Satori has no block layout: every element with children needs an explicit
 * `display: flex` or it mis-renders silently. No custom font is loaded — at
 * 32px the difference from Geist is invisible, and `opengraph-image.tsx`
 * already ships fontless.
 */

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
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2,
          paddingBottom: 4,
          backgroundColor: "#07111f",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: -1,
            lineHeight: 1,
            color: "#f5f7fa",
          }}
        >
          d
        </div>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            backgroundColor: "#55b8ff",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
