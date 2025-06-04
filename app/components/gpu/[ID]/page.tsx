"use client";

import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<{ ID: string }> }) {
  const { ID } = use(params);
  const [cpuData, setCpuData] = useState(null);

  useEffect(() => {
    async function fetchGPUData() {
      try {
        const res = await fetch(`/api/gpu/${ID}`);
        if (!res.ok) {
          throw new Error("Failed to fetch GPU data");
        }
        const data = await res.json();
        setCpuData(data);
      } catch (error) {
        console.error("Error fetching CPU data:", error);
      }
    }
    fetchGPUData();
  }, [ID]);

  return (
    <main>
        <h2>{JSON.stringify(cpuData)}</h2>
    </main>
  )
}