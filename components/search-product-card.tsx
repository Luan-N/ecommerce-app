import Link from "next/link";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from "./ui/card";
import Image from "next/image";

type Product = {
  type: string;
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

interface SearchProductCardProps {
  product: Product;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {

  let url = `/components/${product.type}/${product.ID}`;
  if(product.type === "pc") 
    url = `/pc-selection/${product.ID}`;

  return (
    <Card
      className="flex flex-col items-center my-4 md:flex-row gap-6 md:p-6
    bg-white border border-gray-200 shadow-md
    hover:border-orange-600 hover:shadow-lg hover:-translate-y-1 transform transition-colors"
    >
      {/* CPU Image */}
      <div
        className="w-auto md:w-[150px] md:min-w-[150px] h-auto md:h-[150px] "
        aria-label="cpu-image"
      >
        <Link href={url}>
          <Image
            src={product["Image URL"]}
            alt={product.Name}
            width={150}
            height={150}
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
              href={url}
              className="hover:text-orange-600"
            >
              {product.Name}
            </Link>
          </CardTitle>
        </CardHeader>
        {/* Description */}
        <CardContent className="flex flex-wrap gap-4 text-sm md:text-base text-gray-700">
          {product.Description.map(([key, value]: [string, string], index) => (
            <div key={index} className="flex-1 min-w-[120px]">
              <p className="text-gray-500">{key}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </CardContent>

        {/* View Details */}
        <CardFooter className="justify-center md:justify-end">
          <Link
            href={url}
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
  );
}
