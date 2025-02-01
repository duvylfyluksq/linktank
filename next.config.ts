/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.nesta.org.uk",
      },
    ],
  },
};

export default nextConfig;
