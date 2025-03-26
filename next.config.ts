/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.nesta.org.uk",
			},
			{
				protocol: "http",
				hostname: "**",
			},
			{
				protocol: "https",
				hostname: "**",
			},
		],
		unoptimized: true,
	},
};

export default nextConfig;
