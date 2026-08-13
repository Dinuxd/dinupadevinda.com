/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1", "192.168.1.9"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
