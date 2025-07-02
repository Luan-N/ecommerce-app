import Image from "next/image";

import SpecificationNav from "@/components/specification-nav";
import DescriptionList from "@/components/description-list";
import { getItemInfo } from "@/lib/db-services/component-info";
import ProductsCTA from "@/components/products-cta";
import ScrollUp from "@/components/scroll-up";

type gpuSchema = {
  ID: string;
  "Additional Information": {
    string: string;
  };
  "Image URL": string;
  Type: string;
  Name: string;
  Manufacturer: string;
  Brand: string;
  "Release Date": string;
  Architecture: string;
  "Core Architecture": string;
  "Core Count": number;
  "Clock Speeds": {
    Base: string;
    Boost: string;
  };
  "DirectX Version": number;
  "OpenGL Version": string;
  "PCIe Version": string;
  "Ray Tracing": boolean;
  "Vulkan Version": string;
  "FP32 Compute": string;
  "Fabrication Node": string;
  "Form Factor": string;
  "Max Display Support": number;
  Memory: {
    Type: string;
    Size: string;
    Bandwidth: string;
    "Memory Bus": string;
  };
  Ports: string[];
  Power: {
    TDP: string;
    "Recommended PSU": string;
  };
  ROPs: number;
  "Shader Model": string;
  TMUs: number;
  "Upscaling Technology": string;
};

const sections = [
  "General Information",
  "Architecture Details",
  "Performance Metrics",
  "Connectivity",
  "API Versions",
  "Power Details",
];

export default async function Page({ params }: { params: { ID: string } }) {
  const { ID } = await params;
  let gpu: gpuSchema = await getItemInfo(ID, "gpus");

  return (
    <main className="flex flex-col md:flex-row justify-evenly min-h-screen bg-gray-50 mt-25 mx-5 lg:ml-75 gap-y-10">

      <ScrollUp/>
      <SpecificationNav sections={sections} />

      <section className="flex flex-col min-h-screen lg:w-3/5">
        <div className="grid grid-cols-2 items-center gap-4 p-4 bg-gray-950 rounded-lg shadow-md mb-10">
          {gpu["Image URL"] && (
            <Image
              src={gpu["Image URL"]}
              alt={gpu.Name || "GPU Image"}
              width={150}
              height={150}
              className="object-contain m-3 inline rounded"
            />
          )}

          <h2 className="inline font-bold text-2xl text-white">{gpu.Name}</h2>
        </div>

        <DescriptionList
          items={[
            { label: "Name", value: gpu.Name || "N/A" },
            { label: "Type", value: gpu.Type.toUpperCase() || "N/A" },
            { label: "Manufacturer", value: gpu.Manufacturer || "N/A" },
            { label: "Brand", value: gpu.Brand || "N/A" },
            {
              label: "Release Date",
              value: gpu["Release Date"]
                ? new Date(gpu["Release Date"]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A",
            },
            { label: "Form Factor", value: gpu["Form Factor"] || "N/A" },
          ]}
          title="General Information"
        />

        <DescriptionList
          items={[
            { label: "Architecture", value: gpu.Architecture || "N/A" },
            {
              label: "Core Architecture",
              value: gpu["Core Architecture"] || "N/A",
            },
            {
              label:
                gpu.Manufacturer == "AMD" ? "Stream Processors" : "CUDA Cores",
              value: gpu["Core Count"]?.toString() || "N/A",
            },
            {
              label: "Fabrication Node",
              value: gpu["Fabrication Node"] || "N/A",
            },
            { label: "Ray Tracing", value: gpu["Ray Tracing"].toString() || "N/A" },
          ]}
          title="Architecture Details"
        />

        <DescriptionList
          items={[
            {
              label: "Base Clock",
              value: gpu["Clock Speeds"]?.Base
                ? gpu["Clock Speeds"].Base + " MHz"
                : "N/A",
            },
            {
              label: "Boost Clock",
              value: gpu["Clock Speeds"]?.Boost
                ? gpu["Clock Speeds"].Boost + " MHz"
                : "N/A",
            },
            { label: "Memory Type", value: gpu.Memory?.Type || "N/A" },
            {
              label: "Memory Size",
              value: gpu.Memory?.Size ? gpu.Memory.Size + " GB" : "N/A",
            },
            {
              label: "Memory Bandwidth",
              value: gpu.Memory?.Bandwidth
                ? gpu.Memory.Bandwidth + " GB/s"
                : "N/A",
            },
            {
              label: "Memory Bus",
              value: gpu.Memory?.["Memory Bus"]
                ? gpu.Memory["Memory Bus"] + " bit"
                : "N/A",
            },
            {
              label: "FP32 Compute",
              value: gpu["FP32 Compute"] ? gpu["FP32 Compute"] : "N/A",
            },
            { label: "TMUs", value: gpu.TMUs?.toString() || "N/A" },
            { label: "ROPs", value: gpu.ROPs?.toString() || "N/A" },
          ]}
          title="Performance Metrics"
        />

        <DescriptionList
          items={[
            { label: "Ports", value: gpu.Ports?.join(", ") || "N/A" },
            { label: "Max Display Support", value: gpu["Max Display Support"]?.toString() || "N/A" },
            { label: "PCIe Version", value: gpu["PCIe Version"] || "N/A"},
            
          ]}
          title="Connectivity"
        />

        <DescriptionList
          items={[
            { label: "DirectX Version", value: gpu["DirectX Version"]?.toString() || "N/A" },
            { label: "OpenGL Version", value: gpu["OpenGL Version"] || "N/A" },
            { label: "Vulkan Version", value: gpu["Vulkan Version"] || "N/A" },
            { label: "Shader Model", value: gpu["Shader Model"] || "N/A" },
            { label: "Upscaling Technology", value: gpu["Upscaling Technology"] || "N/A" },
          ]}
          title="API Versions"
        />

        <DescriptionList
          items={[
            {
              label: "TDP",
              value: gpu.Power?.TDP ? gpu.Power.TDP + " W" : "N/A",
            },
            {
              label: "Recommended PSU",
              value: gpu.Power?.["Recommended PSU"]
                ? gpu.Power["Recommended PSU"] + " W"
                : "N/A",
            },
          ]}
          title="Power Details"
        />
      </section>
      <ProductsCTA product={gpu.Name} productid={ID}/>

    </main>
  );
}
