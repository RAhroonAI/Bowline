/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
};

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    runtimeCaching: [
      // Never cache forecast/geocoding APIs — let the app surface the offline state itself
      {
        urlPattern:
          /^https:\/\/(api|marine-api|geocoding-api)\.open-meteo\.com\//,
        handler: "NetworkOnly",
      },
      // Google Fonts CSS
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "google-fonts-css" },
      },
      // Google Fonts files
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      // Next.js build assets
      {
        urlPattern: /\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: { cacheName: "next-static" },
      },
      // PWA assets
      {
        urlPattern:
          /\/(icon-192|icon-512|apple-touch-icon|manifest)\.(png|json)$/,
        handler: "StaleWhileRevalidate",
        options: { cacheName: "pwa-assets" },
      },
      // App shell HTML
      {
        urlPattern: /^\/(daily|before|after|location)?$/,
        handler: "NetworkFirst",
        options: { cacheName: "pages", networkTimeoutSeconds: 4 },
      },
    ],
  },
});

module.exports = withPWA(baseConfig);
