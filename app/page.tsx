"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { CiCircleInfo } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <section
        id="landing"
        className="relative w-full h-[600px] overflow-hidden flex justify-center md:justify-start items-center p-[50px]"
      >
        <Image
          src="/landing_img.jpg"
          alt="Landing Image"
          fill
          className="object-cover"
        />

        {/* Landing Card */}
        <div className="absolute inset-0 flex items-center justify-center">
  <div className="relative bg-white/80 backdrop-blur-sm max-w-lg w-11/12 p-6 md:p-8 rounded-2xl shadow-2xl border border-transparent hover:border-orange-500 transition-colors">
    
    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
      BUILD YOUR DREAM PC — FASTER AND SMARTER
    </h1>
    
    <p className="text-base md:text-lg text-gray-700 mb-6">
      Choose compatible parts, get tailored recommendations, and score the best deals across top retailers.
    </p>
    
    <div className="flex flex-wrap gap-4">
      <Link
        href="/pc-building"
        className="inline-block px-5 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors"
      >
        Start Building
      </Link>
      <Link
        href="/components"
        className="inline-block px-5 py-2 rounded-lg border-2 border-orange-600 text-orange-600 font-medium hover:bg-orange-100 transition-colors"
      >
        Browse Components
      </Link>
    </div>
    
  </div>
</div>

      </section>
      {/* Featured Product */}
      <section className="m-20" id="featured">
        <h2 className="text-xl font-bold mb-5 text-start inline-block">
          Featured
        </h2>
        <div className="relative group inline-block">
          <CiCircleInfo className="inline-block text-xl mb-1.5 ml-1" />

          <div className="absolute -translate-y-15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-sm bg-black text-white px-2 py-1 rounded shadow-md w-max z-10">
            Highlighted pick based on performance, value, and popularity.
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row w-full h-200 md:h-125 justify-between border hover:border-orange-600 rounded-2xl overflow-hidden transition-colors">
 
<div className="md:flex-1 flex flex-col justify-between p-5 bg-gray-50">
    <div>
      <h3 className="text-2xl font-bold">
        RTX 4080 Super Gaming Edition
      </h3>
      <p className="text-gray-600 mt-1">
        4K Ultra Gaming • DLSS 3.5 • GDDR6X
      </p>

      <ul className="mt-4 text-sm text-gray-700 space-y-1">
        <li>
          <strong>GPU:</strong> NVIDIA RTX 4080 Super
        </li>
        <li>
          <strong>VRAM:</strong> 16GB GDDR6X
        </li>
        <li>
          <strong>Ports:</strong> 3x DP, 1x HDMI
        </li>
        <li>
          <strong>Cooling:</strong> Triple-Fan
        </li>
        <li>
          <strong>Power:</strong> 850W PSU Required
        </li>
      </ul>
    </div>

    <div>
      <p className="my-4 text-2xl font-bold text-orange-600">
        ~ $1,199.99
      </p>
 <button className="mt-auto w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors cursor-pointer">
      View Details
    </button>
    </div>

  </div>
          {/* Featured Product Image */}
          <div className="w-full md:w-[70%] flex justify-center">
            <Image
              src="/featured_holder.jpg"
              alt="Featured Product Image"
              width={600}
              height={400}
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </section >
      {/* Carousel */}
      <section className="m-20" id="popular">
        <h2 className="text-xl font-bold mb-5 text-start inline-block">
          Popular
        </h2>
        <div className="relative group inline-block">
          <CiCircleInfo className="inline-block text-xl mb-1.5 ml-1" />

          <div className="absolute -translate-y-15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-sm bg-black text-white px-2 py-1 rounded shadow-md w-max z-10">
            Popular picks based on our recommendations.
          </div>
        </div>
      <Carousel
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="hover:border-orange-600 transition-colors">
                  <CardContent className="flex aspect-square items-center justify-center p-6 ">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </section>
    </>
  );
}
