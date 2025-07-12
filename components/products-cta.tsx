"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Bookmark from "./bookmark";

export default function ProductsCTA({ product, productid, productimg, producttype }: { product: string, productid: string, productimg: string, producttype: string }) {
  const [text, setText] = useState<string>("");

  const query = product.replace(/\s+/g, "+");
  const altquery = product.replace(/\s+/g, "%20");

  const prompt = `Search the internet and give me the most up-to-date price of the following product: ${product}.
    Provide the price in USD. Do not include any other information or text, just the price. If the price is not available, return N/A`;

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.text();
      setText(data);
    };

    fetchPrice();
  }, [product]); // <--- Add this empty dependency array

  return (
    <section
      id="cta"
      className="my-10 flex flex-col justify-start items-center z-20 md:min-w-[300px] md:ml-5 gap-y-2"
    >
      <h2 className="text-sm mb-2 text-black/50 border-b text-center w-full">
        Retailers
      </h2>
      {/* Amazon CTA */}
      <a
        className="w-full flex justify-center h-15 bg-white rounded-lg py-2 border hover:bg-accent hover:cursor-pointer"
        href={`https://www.amazon.com/s?k=${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1206px-Amazon_logo.svg.png"
          alt="Amazon Logo"
          width={200}
          height={200}
          className="h-full w-auto "
        />
      </a>
      {/* Newegg CTA */}
      <a
        className="w-full flex justify-center h-15 bg-white rounded-lg py-2 border hover:bg-accent hover:cursor-pointer"
        href={`https://www.newegg.com/p/pl?d=${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Newegg_logo.svg/1200px-Newegg_logo.svg.png"
          alt="Newegg Logo"
          width={200}
          height={200}
          className="h-full w-auto "
        />
      </a>
      {/* Best Buy CTA */}
      <a
        className="w-full flex justify-center h-15 bg-white rounded-lg py-2 border hover:bg-accent hover:cursor-pointer"
        href={`https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Best_Buy_Logo.svg/1200px-Best_Buy_Logo.svg.png"
          alt="Best Buy Logo"
          width={200}
          height={200}
          className="h-full w-auto "
        />
      </a>
      {/* Best Buy CTA */}
      <a
        className="w-full flex justify-center h-15 bg-white rounded-lg py-2 border hover:bg-accent hover:cursor-pointer"
        href={`https://www.bhphotovideo.com/c/search?q=${altquery}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/B%26H_Photo_Video_logo_2021.svg/1200px-B%26H_Photo_Video_logo_2021.svg.png"
          alt="B&H Logo"
          width={200}
          height={200}
          className="h-full w-auto "
        />
      </a>
      {/* Price Display */}
      <div className="w-full flex justify-center items-center rounded-lg py-2 border mt-2">
        <span className="text-lg">
          {text ? `Estimated Price: ${text}` : "Retrieving estimated price..."}
        </span>
      </div>
      <h2 className="text-sm mt-4 mb-2 text-black/50 border-b text-center w-full">
        Bookmark
      </h2>
      <Bookmark product={product} productid={productid} productimg={productimg} producttype={producttype} />
    </section>
  );
}
