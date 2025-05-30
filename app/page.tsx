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
  console.log("Rendering Home Page");
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
        <div className="absolute bg-white/90 min-w-[350px] rounded w-[80%] md:w-[40%] h-[50%] p-5 border hover:border-orange-600">
          <h1 className="text-xl md:text-2xl font-bold my-5">
            BUILD YOUR DREAM PC - FASTER AND SMARTER.
          </h1>
          <p className="text-sm md:text-base my-5">
            Choose compatible parts, get recommendations, and find the best
            deals across popular retailers.
          </p>
          <Link
            href="/pc-building"
            className="border-orange-600 bg-orange-600 text-white border px-3 py-2 rounded inline-block mr-5 mb-1 text-sm hover:bg-orange-500"
          >
            Start Building
          </Link>
          <Link
            href="/components"
            className="border-orange-600 px-3 py-2 rounded inline-block border text-sm hover:bg-orange-600/10 text-orange-600"
          >
            Browse Components
          </Link>
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

        <div className="flex flex-col-reverse md:flex-row w-full h-200 md:h-125 justify-between border hover:border-orange-600 rounded-2xl overflow-hidden">
          <div className="border-r-1 z-2 md:flex-1 p-5 md:min-w-[240px] bg-gray-50">
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

            <p className="mt-4 text-2xl font-bold text-orange-600">
              ~ $1,199.99
            </p>

            <button className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition cursor-pointer">
              View Details
            </button>
          </div>
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
                <Card className="hover:border-orange-600">
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
