"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CpuPage() {
  const params = useSearchParams();
  //const router = useRouter();

  type cpuSchema = {
    ID: string;
    Name: string;
    Cores: number;
    Threads: number;
    "Boost Clock Frequency": string;
    "L3 Cache": string;
    "Image URL": string;
  };

  const manf = params.get("manf") || "all";
  const [cpus, setCpus] = useState<cpuSchema[]>([]);

  useEffect(() => {
    async function fetchCpus() {
      const res = await fetch(`/api/cpu?manf=${manf}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData.error || "Unknown error");
        return;
      }
      const data = await res.json();
      setCpus(data);
    }
    fetchCpus();
  }, [manf]);

  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* CPU Navigation */}
      <nav className="mb-10 flex justify-center" aria-label="cpu-navigation">
        <div className="flex justify-center items-center bg-gray-200 rounded-sm w-auto ">
          {["All", "AMD", "Intel"].map((manfParam) => {
            const isActive = manf.toLowerCase() == manfParam.toLowerCase();
            return (
              <Link
                key={manfParam}
                href={`/components/cpu?manf=${manfParam.toLowerCase()}`}
                className={`text-base md:text-lg px-3 m-1 rounded-sm hover:bg-white ${
                  isActive ? "bg-white" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {manfParam}
              </Link>
            );
          })}
        </div>
      </nav>

      <h1 className="text-2xl font-bold mb-5">Central Processing Unit (CPU)</h1>
      <p className="mb-5">
        The CPU, or Central Processing Unit, is the brain of your computer...
      </p>

      <div className="space-y-3">
        {cpus.map((cpu, index) => (
          <div key={index} className="p-3 bg-gray-100 rounded-md shadow-sm">
            {cpu.Name}
            <div className="text-sm text-gray-600">
              <p>Cores: {cpu.Cores}</p>
              <p>Threads: {cpu.Threads}</p>
              <p>Boost Clock Frequency: {cpu["Boost Clock Frequency"]}</p>
              <p>L3 Cache: {cpu["L3 Cache"]}</p>
              <Image
                src={cpu["Image URL"]}
                alt={cpu.Name}
                width={200}
                height={200}
                className="rounded-md mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
