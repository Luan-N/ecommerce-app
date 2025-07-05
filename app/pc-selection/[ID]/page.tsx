import ScrollUp from "@/components/scroll-up";
import { getPCInfo } from "@/lib/db-services/pc-info";
import Image from "next/image";
import Link from "next/link";

import { LuPcCase } from "react-icons/lu";

type pcSchema = {
  ID: string;
  Name: string;
  Tier: string;
  CPU: string;
  GPU: string;
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

  return (
    <main className="flex flex-col sm:flex-row items-center justify-center bg-gray-50 mt-25">
      <ScrollUp />

      <div className="flex flex-col items-start justify-start p-5 bg-white rounded-lg shadow-md w-full sm:w-2/3">

      <div className="flex flex-col justify-center mb-5 bg-gray-100 w-full rounded-2xl p-1">
        <h2 className="text-2xl font-bold mb-10 self-center">{pcData.Name}</h2>

        <Image
          src={`/pc-images/${pcData.Name}.png`}
          alt={pcData.Name}
          width={400}
          height={400}
          className="mx-auto mb-10 block object-contain"
        />
      </div>
        

        {/* SPECIFICATIONS */}
        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData.Case["Image URL"]}
            alt={pcData.Case.Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">

            <span className="font-bold text-orange-800">CASE</span>

            <Link href={pcData.Case.URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData.Case.Name}</Link>
          </div>
        </div>

        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData.Cooler["Image URL"]}
            alt={pcData.Cooler.Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-bold text-orange-800">COOLER</span>
            <Link href={pcData.Cooler.URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData.Cooler.Name}</Link>
          </div>
        </div>

        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData.Motherboard["Image URL"]}
            alt={pcData.Motherboard.Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-bold text-orange-800">MOTHERBOARD</span>
            <Link href={pcData.Motherboard.URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData.Motherboard.Name}</Link>
          </div>
        </div>

        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData["Power Supply"]["Image URL"]}
            alt={pcData["Power Supply"].Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-bold text-orange-800">POWER SUPPLY</span>
            <Link href={pcData["Power Supply"].URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData["Power Supply"].Name}</Link>
          </div>
        </div>

        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData.RAM["Image URL"]}
            alt={pcData.RAM.Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-bold text-orange-800">RAM</span>
            <Link href={pcData.RAM.URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData.RAM.Name}</Link>
          </div>
        </div>

        <div className="flex items-center justify-start w-full mb-10 border-b ">
          <Image
            src={pcData.Storage["Image URL"]}
            alt={pcData.Storage.Name}
            width={50}
            height={50}
            className="h-auto block flex-shrink-0 w-25 text-orange-800"
          />
          <div className="flex flex-col items-start justify-start">
            <span className="font-bold text-orange-800">STORAGE</span>
            <Link href={pcData.Storage.URL} className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">{pcData.Storage.Name}</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
