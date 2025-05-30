import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['m.media-amazon.com', "c1.neweggimages.com", "www.amd.com", 
      "90a1c75758623581b3f8-5c119c3de181c9857fcb2784776b17ef.ssl.cf2.rackcdn.com", 
      "i.ebayimg.com", "i5.walmartimages.com", "cdn11.bigcommerce.com", 
      "www.nvidia.com", "hexus.net", "images.nvidia.com", "tpucdn.com",
      "images.anandtech.com", "thinglabs.io", "pisces.bbystatic.com",
      "cdn.videocardz.com", "pcoutlet.com", "computercity.com", "assetsio.gnwcdn.com"],
    
  },
  //reactStrictMode: false,
};

export default nextConfig;
