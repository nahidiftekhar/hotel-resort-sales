/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  swcMinify: true,
  output: 'export',
};

module.exports = {
  reactStrictMode: true,
  // assetPrxefix: './',
  output: 'export',
  // trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: ['images.unsplash.com', 'localhost'],
  },
};

// Working config on 2023-03-12
// reactStrictMode: true,
// output: 'export',
// sassOptions: {
//   includePaths: [path.join(__dirname, "styles")],
// },
// swcMinify: true,
// experimental: { appDir: true },
