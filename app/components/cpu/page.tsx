"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardAction,
  Card,
} from "@/components/ui/card";

import Pagination from "@/components/pagination";

type cpuSchema = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  "Boost Clock Frequency": string;
  "L3 Cache": string;
  "Image URL": string;
};

export default function CpuPage() {
  const params = useSearchParams();

  const manfParam = params.get("manf") || "all"; // Default to "all" if not provided
  const pageParam = params.get("page") || 1; // Default to page 1 if not provided

  const [cpus, setCpus] = useState<cpuSchema[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchCpus() {
      console.log(
        "Fetching CPUs with params:" + manfParam + " page: " + pageParam
      );
      const res = await fetch(`/api/cpu?manf=${manfParam}&page=${pageParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData.error || "Unknown error");
        return;
      }
      const data = await res.json();
      setCpus(data.items);
      setTotalPages(data.totalPages);
    }
    fetchCpus();
  }, [manfParam, pageParam]);

  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* CPU Navigation */}
      <nav className="mb-10 flex justify-center" aria-label="cpu-navigation">
        <div className="flex justify-center items-center bg-white border rounded-sm w-auto">
          {["All", "AMD", "Intel"].map((manf) => {
            const isActive = manfParam?.toLowerCase() == manf.toLowerCase();
            return (
              <Link
                key={manf}
                href={`/components/cpu?manf=${manf.toLowerCase()}`}
                className={`text-lg px-5 w-auto rounded-sm hover:bg-accent ${
                  isActive ? "bg-gray-200" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {manf}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Pagination */}
        <Pagination
          totalPages={totalPages}
        />

      <h1 className="text-2xl font-bold mb-5">Central Processing Unit (CPU)</h1>

      <section aria-label="cpu-list">
        {cpus.map((cpu, index) => (
          <Card
            key={index}
            className="flex flex-col items-center md:flex-row gap-4 p-4 bg-white shadow-md border border-gray-200 hover:border-orange-600 my-3"
          >
            {/* CPU Image */}
            <div
              className="w-auto md:w-[150px] md:min-w-[150px] h-auto md:h-[150px] "
              aria-label="cpu-image"
            >
              <Link href={`/components/${cpu.ID}`}>
                <Image
                  src={cpu["Image URL"]}
                  alt={cpu.Name}
                  width={200}
                  height={200}
                  className="h-auto w-auto"
                />
              </Link>
            </div>

            {/* CPU Details */}
            <div className="flex flex-col justify-between flex-grow gap-5">
              {/* Name */}
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Link
                    href={`/components/${cpu.ID}`}
                    className="hover:text-orange-600"
                  >
                    {cpu.Name} {cpu.Cores}C/{cpu.Threads}T Max Processor Speed{" "}
                    {cpu["Boost Clock Frequency"]} Mhz {cpu["L3 Cache"]} L3
                    Cache
                  </Link>
                </CardTitle>
              </CardHeader>
              {/* Description */}
              <CardContent className="flex flex-wrap gap-4 text-sm md:text-base text-gray-700 mt-4">
                <div className="flex-1 min-w-[120px]">
                  <p className="text-gray-500">Processor Type</p>
                  <p className="font-semibold">
                    {cpu.Name.match(/(Ryzen\s\d|Core\s\w\d)/i)}
                  </p>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="text-gray-500">Processor Max Speed</p>
                  <p className="font-semibold">
                    {cpu["Boost Clock Frequency"]} Mhz
                  </p>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="text-gray-500">Cores/Threads</p>
                  <p className="font-semibold">
                    {cpu.Cores}C/{cpu.Threads}T
                  </p>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <p className="text-gray-500">L3 Cache</p>
                  <p className="font-semibold">{cpu["L3 Cache"]} MB</p>
                </div>
              </CardContent>

              {/* View Details */}
              <CardFooter className="justify-center md:justify-end">
                <Link
                  href={`/components/${cpu.ID}`}
                  className=" bg-orange-600 text-white px-2 py-1 rounded-sm hover:bg-orange-500"
                >
                  View Details
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
        />
      </section>
    </main>
  );
}
