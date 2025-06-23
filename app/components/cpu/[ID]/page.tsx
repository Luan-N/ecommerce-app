import Image from "next/image";

import SpecificationNav from "@/components/specification-nav";
import DescriptionList from "@/components/description-list";
import { getItemInfo } from "@/lib/db-services/info-utils";
import ProductsCTA from "@/components/products-cta";
import ScrollUp from "@/components/scroll-up";

type cpuSchema = {
  Type: string;
  ID: string;
  Name: string;
  Manufacturer: string;
  Brand: string;
  Cores: number;
  Threads: number;
  "Efficiency Cores"?: number;
  "Performance Cores"?: number;
  "Base Clock Frequency": string;
  "Boost Clock Frequency": string;
  "Efficiency Base Clock Frequency"?: string;
  "Efficiency Boost Clock Frequency"?: string;
  TDP: string;
  "Turbo Max TDP"?: string;
  "Socket Type": string;
  "Integrated Graphics": string;
  "Unlocked for Overclocking": boolean;
  "Stock Cooler": string;
  "Release Date": string;
  Architecture: string;
  "L1 Cache": string;
  "L2 Cache": string;
  "L3 Cache": string;
  "PCIe Version": string;
  "Supported Chipsets": string[];
  "Memory Support": string;
  "Max Memory": number;
  "Max Operating Temperature": string;
  "Image URL": string;
  "Boosting Technologies": string[];
  "Overclock Technologies": string[];
  "Efficiency-core Base Clock"?: string;
  "Efficiency-core Turbo Clock"?: string;
};

const sections = [
  "Identification",
  "Architecture & Design",
  "Performance",
  "Thermal & Power",
  "Cache Memory",
  "Memory",
  "Cooling Solutions",
];

export default async function Page({ params }: { params: { ID: string } }) {
  const { ID } = await params;
  let cpu: cpuSchema = await getItemInfo(ID, "cpus");

  return (
    <main className="flex flex-col md:flex-row justify-evenly min-h-screen bg-gray-50 mt-25 mx-5 lg:ml-75 gap-y-10">

      <ScrollUp/>
      <SpecificationNav sections={sections} />

      <section className="flex flex-col min-h-screen lg:w-3/5">
        <div className="grid grid-cols-2 items-center gap-4 p-4 bg-gray-950 rounded-lg shadow-md mb-10">
          {cpu?.["Image URL"] && (
            <Image
              src={cpu["Image URL"]}
              alt={cpu.Name || "CPU Image"}
              width={150}
              height={150}
              className="object-contain m-3 inline rounded"
            />
          )}

          <h2 className="inline font-bold text-2xl text-white">{cpu?.Name}</h2>
        </div>

        {/* DescriptionList components can remain Server Components */}
        <DescriptionList
          items={[
            { label: "Type", value: cpu?.Type.toUpperCase() || "N/A" },
            { label: "Name", value: cpu?.Name || "N/A" },
            { label: "Manufacturer", value: cpu?.Manufacturer || "N/A" },
            { label: "Brand", value: cpu?.Brand || "N/A" },
            {
              label: "Release Date",
              value: cpu?.["Release Date"]
                ? new Date(cpu["Release Date"]).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A",
            },
          ]}
          title="Identification"
        />

        <DescriptionList
          items={[
            { label: "Architecture", value: cpu?.Architecture || "N/A" },
            { label: "Socket Type", value: cpu?.["Socket Type"] || "N/A" },
            {
              label: "Integrated Graphics",
              value: cpu?.["Integrated Graphics"] || "N/A",
            },
            {
              label: "Unlocked (Overclocking)",
              value:
                cpu?.["Unlocked for Overclocking"] === true
                  ? "Unlocked"
                  : "Locked",
            },
            { label: "PCIe Version", value: cpu?.["PCIe Version"] || "N/A" },
            {
              label: "Supported Chipsets",
              value: cpu?.["Supported Chipsets"]?.join(", ") || "N/A",
            },
          ]}
          title="Architecture & Design"
        />

        <DescriptionList
          items={[
            { label: "Cores", value: cpu?.Cores || "N/A" },
            { label: "Threads", value: cpu?.Threads || "N/A" },
            {
              label: "Efficiency Cores",
              value: cpu?.["Efficiency Cores"]?.toString() || "N/A",
            },
            {
              label: "Performance Cores",
              value: cpu?.["Performance Cores"]?.toString() || "N/A",
            },
            {
              label: "Base Core Clock",
              value: cpu?.["Base Clock Frequency"] + " GHz" || "N/A",
            },
            {
              label: "Boost Clock Frequency",
              value: cpu?.["Boost Clock Frequency"] + " GHz" || "N/A",
            },
            // Only display if relevant
            ...(cpu?.Manufacturer === "Intel" &&
            cpu?.["Efficiency Base Clock Frequency"]
              ? [
                  {
                    label: "Efficiency Base Clock Frequency",
                    value:
                      cpu?.["Efficiency Base Clock Frequency"] + " GHz" ||
                      "N/A",
                  },
                ]
              : []),
            ...(cpu?.Manufacturer === "Intel" &&
            cpu?.["Efficiency Boost Clock Frequency"]
              ? [
                  {
                    label: "Efficiency Boost Clock Frequency",
                    value:
                      cpu?.["Efficiency Boost Clock Frequency"] + " GHz" ||
                      "N/A",
                  },
                ]
              : []),
            {
              label: "Boosting Technologies",
              value: cpu?.["Boosting Technologies"]?.join(", ") || "N/A",
            },
            {
              label: "Overclocking Technologies",
              value: cpu?.["Overclock Technologies"]?.join(", ") || "N/A",
            },
          ]}
          title="Performance"
        />

        <DescriptionList
          items={[
            { label: "TDP", value: cpu?.TDP + " W" || "N/A" },
            {
              label: "Turbo Max TDP",
              value: cpu?.["Turbo Max TDP"] + " W" || "N/A",
            },
            {
              label: "Max Operating Temperature",
              value: cpu?.["Max Operating Temperature"] + " °C" || "N/A",
            },
          ]}
          title="Thermal & Power"
        />

        <DescriptionList
          items={[
            { label: "L1 Cache", value: cpu?.["L1 Cache"] || "N/A" },
            { label: "L2 Cache", value: cpu?.["L2 Cache"] || "N/A" },
            { label: "L3 Cache", value: cpu?.["L3 Cache"] || "N/A" },
          ]}
          title="Cache Memory"
        />

        <DescriptionList
          items={[
            {
              label: "Memory Support",
              value: cpu?.["Memory Support"] || "N/A",
            },
            {
              label: "Max Memory",
              value: cpu?.["Max Memory"] + " GB" || "N/A",
            },
          ]}
          title="Memory"
        />

        <DescriptionList
          items={[
            { label: "Stock Cooler", value: cpu?.["Stock Cooler"] || "N/A" },
          ]}
          title="Cooling Solutions"
        />
      </section>
      <ProductsCTA product={cpu.Name}/>

    </main>
  );
}
