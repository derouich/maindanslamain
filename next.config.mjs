/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Remove the deprecated 'domains' and use 'remotePatterns' only
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        pathname: '/**', // Allow all images under this domain
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
