/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3500',
            pathname: '/**',
          },
          {
            protocol: 'http',
            hostname: '46.28.44.16',
            port: '3500',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'api.kalantarart.org',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
