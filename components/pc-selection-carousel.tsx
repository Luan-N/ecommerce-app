"use client";

import  Link  from "next/link";
import { CiCircleInfo } from "react-icons/ci";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { useEffect, useState } from "react";

type PcItem = {
    ID: string;
    Name: string;
    "GPU Type": string;
    "CPU Type": string;
    Tier: string;
}

export default function PCSelectionCarousel({ tier, description }: { tier: string, description: string }) {

  //const [page, setPage] = useState(1);
  //setPage(1); // Reset to page 1 when tier changes
  const [items, setItems] = useState<PcItem[]>([]);

  useEffect(() => {
    const fetchPcItems = async () => {
      const response = await fetch("/api/pc-filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier: tier}),
      });
      const data = await response.json();
      setItems(data || []);
    };
    fetchPcItems();
  }, [tier]);

  return (
    <section className=" my-10">
      <h2 className="text-xl font-bold mb-5 text-start inline-block">{tier}</h2>
      <div className="relative group inline-block">
        <CiCircleInfo className="inline-block text-xl mb-1.5 ml-1" />

        <div className="absolute -translate-y-15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-sm bg-black text-white px-2 py-1 rounded shadow-md w-max z-10">
          {description}
        </div>
      </div>
      <Carousel>
        <CarouselContent>
          {items.map((value, index) => (
              <CarouselItem
                key={index}
                className="basis-1/1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Card className="hover:border-orange-600 border-transparent border-2 transition-all duration-200 hover:shadow-2xl h-full">
                  <CardContent className="flex flex-col items-center justify-start p-0">
                    <Link
                      className="block w-full p-4 border-b border-gray-200"
                      href={`/pc-selection/${value.ID}`}
                    >
                      <Image
                        src={`/pc-images/${value.Name}.png`}
                        alt={value.Name}
                        width={300}
                        height={300}
                        className="w-auto mx-auto"
                      />
                    </Link>
                      <Link
                        href={`/pc-selection/${value.ID}`}
                        className="text-lg font-semibold hover:text-orange-600 text-center block"
                      >
                        {value.Name}
                      </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
}
