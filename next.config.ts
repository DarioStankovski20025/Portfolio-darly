import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Nodemailer resolves its transports with dynamic `require()`, which a bundler
    cannot follow — bundled, it fails at runtime with "Cannot find module
    './smtp-transport'". It is not on Next's auto-externalise list, so it has to
    be named here.
  */
  serverExternalPackages: ["nodemailer"],

  poweredByHeader: false,

  /*
    Hygiene rather than SEO — none of these are ranking factors. Deliberately no
    Content-Security-Policy: Next injects inline bootstrap scripts and
    framer-motion writes inline styles on every animated element, so a naive
    `script-src 'self'` blanks the site. A real CSP needs the nonce-via-proxy
    setup and is its own piece of work.
  */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
