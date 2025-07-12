import ScrollUp from "@/components/scroll-up";
import { getPCInfo } from "@/lib/db-services/pc-info";
import Image from "next/image";
import Link from "next/link";
import { GoCpu } from "react-icons/go";
import { BsGpuCard } from "react-icons/bs";
import Bookmark from "@/components/bookmark";

type pcSchema = {
  ID: string;
  Name: string;
  Tier: string;
  CPU: string; // Assuming CPU is a string, e.g., "Intel Core i7-12700K"
  GPU: string; // Assuming GPU is a string, e.g., "NVIDIA GeForce RTX 3080"
  Case: {
    "Image URL": string;
    Name: string;
    URL: string;
  };
  Cooler: {
    "Image URL": string;
    Name: string;
    URL: string;
  };
  Motherboard: {
    "Image URL": string;
    Name: string;
    URL: string;
  };
  "Power Supply": {
    "Image URL": string;
    Name: string;
    URL: string;
  };
  RAM: {
    "Image URL": string;
    Name: string;
    URL: string;
  };
  Storage: {
    "Image URL": string;
    Name: string;
    URL: string;
  };
};

export default async function Page({ params }: { params: { ID: string } }) {
  const { ID } = await params;

  const pcData = (await getPCInfo(ID)) as pcSchema;

  const cpuMatch = pcData.Name.match(/(Intel\sCore|AMD\sRyzen)\s[\w\d\s\-\.]+/gi);
  const cpuName = cpuMatch ? cpuMatch[0] : "Unknown";
  const gpuName = pcData.Name.substring(0, pcData.Name.indexOf(cpuName)) || "N/A";

  return (
    <main className="flex flex-col sm:flex-row items-center justify-center bg-gray-50 mt-20 sm:mt-24 px-4 py-8">
      <ScrollUp />

      <div className="flex flex-col items-start justify-start p-5 bg-white rounded-lg shadow-md w-full sm:w-2/3 max-w-2xl">

        {/* PC Name and Image Section */}
        <div className="flex flex-col justify-center mb-6 bg-gray-100 w-full rounded-2xl p-4">
          <h2 className="text-3xl font-bold mb-6 self-center text-gray-800">{pcData.Name}</h2>

          <Image
            src={`/pc-images/${pcData.Name}.png`} // Assuming this path is correct for your images
            alt={pcData.Name}
            width={500}
            height={500}
            className="mx-auto mb-6 block object-contain max-h-96 rounded-lg" // Added rounded-lg for consistency
          />
        </div>

        {/* Bookmarks */}
          <Bookmark product={pcData.Name} productid={ID} productimg={`/pc-images/${pcData.Name}.png`} producttype="PC" />

        {/* SPECIFICATIONS */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-700 w-full border-b pb-2">Specifications</h3>

        {/* CPU */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <GoCpu className="h-12 w-12 text-gray-600 mr-4 flex-shrink-0" /> 
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">CPU</span>
            <Link href={`/components/cpu/${pcData.CPU}`} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors">{cpuName}</Link>
          </div>
        </div>

        {/* GPU */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <BsGpuCard className="h-12 w-12 text-gray-600 mr-4 flex-shrink-0" />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">GPU</span>
            <Link href={`/components/gpu/${pcData.GPU}`} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors">{gpuName}</Link>
          </div>
        </div>

        {/* Case */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData.Case["Image URL"]}
            alt={pcData.Case.Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">Case</span>
            <Link href={pcData.Case.URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData.Case.Name}</Link>
          </div>
        </div>

        {/* Cooler */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData.Cooler["Image URL"]}
            alt={pcData.Cooler.Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">Cooler</span>
            <Link href={pcData.Cooler.URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData.Cooler.Name}</Link>
          </div>
        </div>

        {/* Motherboard */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData.Motherboard["Image URL"]}
            alt={pcData.Motherboard.Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">Motherboard</span>
            <Link href={pcData.Motherboard.URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData.Motherboard.Name}</Link>
          </div>
        </div>

        {/* Power Supply */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData["Power Supply"]["Image URL"]}
            alt={pcData["Power Supply"].Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">Power Supply</span>
            <Link href={pcData["Power Supply"].URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData["Power Supply"].Name}</Link>
          </div>
        </div>

        {/* RAM */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData.RAM["Image URL"]}
            alt={pcData.RAM.Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">RAM</span>
            <Link href={pcData.RAM.URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData.RAM.Name}</Link>
          </div>
        </div>

        {/* Storage */}
        <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-200">
          <Image
            src={pcData.Storage["Image URL"]}
            alt={pcData.Storage.Name}
            width={50}
            height={50}
            className="h-12 w-12 object-contain mr-4 flex-shrink-0"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-semibold text-sm text-orange-800 text-semibold uppercase">Storage</span>
            <Link href={pcData.Storage.URL} className="text-lg font-medium text-gray-800 hover:text-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">{pcData.Storage.Name}</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
