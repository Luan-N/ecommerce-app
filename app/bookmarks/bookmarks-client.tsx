"use client";

import Image from "next/image";
import Link from "next/link";

export default function Bookmark() {

  const bookmarks = localStorage.getItem("bookmarks");
  const parsedBookmarks = bookmarks ? JSON.parse(bookmarks) : [];

  return (
    <>
      {parsedBookmarks.length === 0 ? (
        <span className="text-gray-500">No bookmarks yet</span>
      ) : (
        parsedBookmarks.map((bookmark: string, index: number) => {
          const [productid, product, productimg, producttype] =
            bookmark.split("|");
          const url =
            producttype === "PC"
              ? `/pc-selection/${productid}`
              : `/components/${producttype.toLowerCase()}/${productid}`;
          return (
            <div
              key={index}
              className="flex items-center m-2 border-b border-accent h-20 w-full"
            >
              <Link href={url}>
                <Image
                  src={productimg}
                  alt={product}
                  width={50}
                  height={50}
                  className="h-20 w-20 object-contain"
                />
              </Link>
              <div className="flex flex-col justify-center ml-4">
                <Link
                  href={url}
                  className="text-base font-semibold text-gray-800 hover:text-orange-600"
                >
                  {product.toUpperCase()}
                </Link>
                <span className="text-base text-gray-600">
                  Type: {producttype.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
