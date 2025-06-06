import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'c1.neweggimages.com' },
      { protocol: 'https', hostname: 'www.amd.com' },
      { protocol: 'https', hostname: '90a1c75758623581b3f8-5c119c3de181c9857fcb2784776b17ef.ssl.cf2.rackcdn.com' },
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: 'i5.walmartimages.com' },
      { protocol: 'https', hostname: 'cdn11.bigcommerce.com' },
      { protocol: 'https', hostname: 'www.nvidia.com' },
      { protocol: 'https', hostname: 'hexus.net' },
      { protocol: 'https', hostname: 'images.nvidia.com' },
      { protocol: 'https', hostname: 'tpucdn.com' },
      { protocol: 'https', hostname: 'images.anandtech.com' },
      { protocol: 'https', hostname: 'thinglabs.io' },
      { protocol: 'https', hostname: 'pisces.bbystatic.com' },
      { protocol: 'https', hostname: 'cdn.videocardz.com' },
      { protocol: 'https', hostname: 'pcoutlet.com' },
      { protocol: 'https', hostname: 'computercity.com' },
      { protocol: 'https', hostname: 'assetsio.gnwcdn.com' },
    ],
  },
  //reactStrictMode: false,
};

export default nextConfig;
