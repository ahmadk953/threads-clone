// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio } = require('@edgio/next/config')

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
      serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.clerk.com",
        },
        {
          protocol: "https",
          hostname: "images.clerk.dev",
        },
        {
          protocol: "https",
          hostname: "uploadthing.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
      typescript: {
        ignoreBuildErrors: true,
      },
    },
};

const _preEdgioExport = nextConfig;;

module.exports = (phase, config) =>
  withEdgio({
    ..._preEdgioExport
  })