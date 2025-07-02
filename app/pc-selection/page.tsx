import ComponentFilter from "@/components/item-filter";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Link } from "lucide-react";
import React from "react";

export default function Products() {
  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* Navigation */}
      <nav
        className="mb-10 flex justify-center flex-col sm:flex-row sm:gap-x-20"
        aria-label="pc-navigation"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">CPU</h2>
          <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
            {["All", "AMD", "Intel"].map((manf) => (
              <ComponentFilter k="cpu" v={manf} key={manf} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">GPU</h2>
          <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
            {["All", "AMD", "NVIDIA"].map((manf) => (
              <ComponentFilter k="gpu" v={manf} key={manf} />
            ))}
          </div>
        </div>

        {/* <Carousel>
          <CarouselContent>
            {otherFeatured.map((value, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
                    <div className="p-4 w-full">
                      <Link
                        href={`/pc-selection/${value.ID}`}
                        className="text-lg font-semibold hover:text-orange-600 text-center block"
                      >
                        {value.Name}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel> */}
      </nav>
    </main>
  );
}
