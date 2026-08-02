import type { NextConfig } from "next";

const scriptSrc = process.env.NODE_ENV === "production"
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["pdfkit", "nodemailer"],
  compress: true,
  turbopack: { root: __dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
        ],
      },
      {
        source: "/:seoAsset(hero-bg|og-image).jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/products/industrial-metals", destination: "/products/metals-alloys", permanent: true },
      { source: "/products/industrial-materials", destination: "/products/industrial-raw-materials", permanent: true },
      { source: "/products/general-sourcing", destination: "/products/custom-sourcing", permanent: true },
      { source: "/products/packaging-materials", destination: "/products/packaging-commercial-supplies", permanent: true },
      { source: "/products/industrial-scrap", destination: "/products/industrial-scrap-recyclable-materials", permanent: true },
      { source: "/products/ferrous-metals", destination: "/products/metals-alloys", permanent: true },
      { source: "/products/non-ferrous-metals", destination: "/products/metals-alloys", permanent: true },
      { source: "/products/plastics", destination: "/products/industrial-raw-materials", permanent: true },
      { source: "/products/paper-cardboard", destination: "/products/industrial-scrap-recyclable-materials", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
    ];
  },
};

export default nextConfig;
