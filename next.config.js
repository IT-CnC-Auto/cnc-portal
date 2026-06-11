/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Root shows the login page (public/index.html)
      { source: '/', destination: '/index.html' },
      // Clean /home URL shows the portal (public/home.html)
      { source: '/home', destination: '/home.html' },
    ]
  },
}

module.exports = nextConfig
