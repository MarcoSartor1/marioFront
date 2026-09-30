/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 8 MB de archivos más campos y delimitadores del formulario.
    serverActionsBodySizeLimit: '10mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001'
      }
    ]
  }
}

module.exports = nextConfig
