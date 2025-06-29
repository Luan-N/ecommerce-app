import Image from "next/image";
import Link from "next/link";
import { CiCircleInfo } from "react-icons/ci";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { fetchFirestoreDocument } from "@/lib/db-services/firestore-db";

export default async function Home() {
  // Fetch featured product data from Firestore
  const featuredProducts = (await fetchFirestoreDocument(
    "pc-combinations",
    "featured"
  )) as {
    "Main Featured": {
      Name: string;
      "Image URL": string;
      "Short Description": string;
      Price: number;
      ID: string;
      CPU: string;
      GPU: string;
      RAM: string;
      VRAM: string;
      "L3 Cache": string;
    };
    "Other Featured": {
      ID: string;
      Name: string;
      "Image URL": string;
    }[];
  };

  const featured = featuredProducts["Main Featured"];
  const otherFeatured = featuredProducts["Other Featured"];

  return (
    <main>
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
              Choose compatible parts, get tailored recommendations, and score
              the best deals across top retailers.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/pc-building"
                className="inline-block px-5 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-500 transition-colors"
              >
                Start Building
              </Link>
              <Link
                href="/components/cpu"
                className="inline-block px-5 py-2 rounded-lg border-2 border-orange-600 text-orange-600 font-medium hover:bg-orange-100 transition-colors"
              >
                Browse Components
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Product */}
      <section className="mx-5 md:mx-15 my-20" id="featured">
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
              <Link
                href={`/pc-selection/${featured.ID}`}
                className="text-2xl font-bold hover:text-orange-600 "
              >
                {featured.Name}
              </Link>
              <p className="text-gray-600 mt-1">
                {featured["Short Description"]}
              </p>

              <ul className="mt-4 text-sm text-gray-700 space-y-1">
                <li>
                  <span className="font-semibold my-5">CPU:</span>{" "}
                  {featured.CPU}
                </li>
                <li>
                  <span className="font-semibold my-5">GPU:</span>{" "}
                  {featured.GPU}
                </li>
                <li>
                  <span className="font-semibold my-5">RAM:</span>{" "}
                  {featured.RAM}
                </li>
                <li>
                  <span className="font-semibold my-5">VRAM:</span>{" "}
                  {featured.VRAM}
                </li>
                <li>
                  <span className="font-semibold my-5">L3 Cache:</span>{" "}
                  {featured["L3 Cache"]}
                </li>
              </ul>
            </div>

            <div>
              <p className="my-4 text-2xl font-bold text-orange-600">
                ~ ${featured.Price.toFixed(2)}
              </p>
              <Link
                href={`/pc-selection/${featured.ID}`}
                className="mt-auto block text-center w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 transition-colors cursor-pointer"
              >
                View Details
              </Link>
            </div>
          </div>
          {/* Featured Product Image */}
          <Link
            href={`/pc-selection/${featured.ID}`}
            className="w-full md:w-[60%] flex justify-center"
          >
            <Image
              src={`/pc-images/${featured.Name}.png`}
              alt="Featured Product Image"
              width={600}
              height={400}
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>
      </section>
      {/* Carousel */}
      <section className="mx-5 md:mx-15 my-20" id="popular">
        <h2 className="text-xl font-bold mb-5 text-start inline-block">
          Popular
        </h2>
        <div className="relative group inline-block">
          <CiCircleInfo className="inline-block text-xl mb-1.5 ml-1" />

          <div className="absolute -translate-y-15 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-sm bg-black text-white px-2 py-1 rounded shadow-md w-max z-10">
            Popular picks based on our recommendations.
          </div>
        </div>
        <Carousel>
          <CarouselContent>
            {otherFeatured.map((value, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="hover:border-orange-600 transition-colors h-full">
                  <CardContent className="flex flex-col items-center justify-between p-3">
                    <Link href={`/pc-selection/${value.ID}`}>
                    <Image
                      src={`/pc-images/${value.Name}.png`}
                      alt={value.Name}
                      width={300}
                      height={300}
                      className="w-auto"
                    />
                    </Link>
                    <Link
                      href={`/pc-selection/${value.ID}`}
                      className="text-xl font-semibold hover:text-orange-600"
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
    </main>
  );
}
