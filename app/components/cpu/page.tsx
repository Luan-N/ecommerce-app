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

import BreadCrumbNavigation from "@/components/breadcrumbnav";

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
        <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
          {["All", "AMD", "Intel"].map((manf) => {
            const isActive = manfParam?.toLowerCase() === manf.toLowerCase();
            return (
              <Link
                key={manf}
                href={`/components/cpu?manf=${manf.toLowerCase()}`}
                className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-white text-black shadow"
                    : "text-muted-foreground hover:bg-white/30"
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
      <Pagination totalPages={totalPages} />

      {/* Bread Crumb */}
      <BreadCrumbNavigation
        items={[
          { name: "Home", href: "/" },
          { name: "Components", href: "/Components" },
          { name: "CPU" }, // Current page
        ]}
      />

      <section aria-label="cpu-list">
        {cpus.map((cpu, index) => (
          <Card
            key={index}
            className="flex flex-col items-center my-4 md:flex-row gap-6 p-6
    bg-white border border-gray-200 shadow-md
    hover:border-orange-600 hover:shadow-lg hover:-translate-y-1 transform transition"
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
                    {cpu.Name.match(/(?:Ryzen\s\d|Core\s[im]\d)/i)}
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
                  <p className="font-semibold">{cpu["L3 Cache"]}</p>
                </div>
              </CardContent>

              {/* View Details */}
              <CardFooter className="justify-center md:justify-end mt-4">
                <Link
                  href={`/components/${cpu.ID}`}
                  className="
        bg-orange-600 text-white font-semibold px-4 py-2 rounded-md
        hover:bg-orange-700 active:bg-orange-800
        transition-colors
        shadow-sm hover:shadow-md
      "
                >
                  View Details
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  );
}
