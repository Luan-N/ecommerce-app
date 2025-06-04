"use client";

import { use, useEffect, useState } from "react";

type cpuSchema = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  "Boost Clock Frequency": string;
  "L3 Cache": string;
  "Image URL": string;
};

export default function Page({ params }: { params: Promise<{ ID: string }> }) {
  const { ID } = use(params);
  const [cpuData, setCpuData] = useState<cpuSchema[]>([]);

  useEffect(() => {
    async function fetchCPUData() {
      try {
        const res = await fetch(`/api/cpu/${ID}`);
        if (!res.ok) {
          throw new Error("Failed to fetch CPU data");
        }
        const data = await res.json();
        setCpuData(data);
      } catch (error) {
        console.error("Error fetching CPU data:", error);
      }
    }
    fetchCPUData();
  }, [ID]);

  return (
    <main>
        <h2>{JSON.stringify(cpuData)}</h2>
    </main>
  )
}