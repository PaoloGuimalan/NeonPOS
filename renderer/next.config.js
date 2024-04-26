/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"]
  }
}
