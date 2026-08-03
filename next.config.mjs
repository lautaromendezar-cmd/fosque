/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: import.meta.dirname,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
