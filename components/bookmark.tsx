"use client";

import { get } from "http";
import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";

export default function Bookmark({
  product,
  productid,
  productimg,
  producttype
}: {
  product: string;
  productid: string;
  productimg: string;
  producttype: string;
}) {
  const [isBookMarked, setIsBookMarked] = useState(false);

  const bookmarkProduct = productid + "|" + product + "|" + productimg + "|" + producttype;

  function getBookmarks() {
    const bookmarksStr = localStorage.getItem("bookmarks");
    const bookmarks = bookmarksStr ? JSON.parse(bookmarksStr) : [];
    return bookmarks;
  }

  useEffect(() => {
    const bookmarks = getBookmarks();
    setIsBookMarked(bookmarks.includes(bookmarkProduct));
  }, [bookmarkProduct]);

  // Toggle function
  function toggleBookmark(product: string) {
    const bookmarks = getBookmarks();

    if (bookmarks.includes(product)) {
      // Remove bookmark
      const index = bookmarks.indexOf(product);
      bookmarks.splice(index, 1);
    } else {
      // Add bookmark
      console.log("Adding bookmark for:", product);
      bookmarks.push(product);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setIsBookMarked(bookmarks.includes(bookmarkProduct));
  }

  return (
    <button
      onClick={() => toggleBookmark(bookmarkProduct)}
      className={`w-full px-4 py-2 transition-colors cursor-pointer rounded ${isBookMarked ? "bg-white text-orange-600 hover:bg-orange-100 border border-orange-600" : "bg-orange-600 text-white hover:bg-orange-500 "}`}
    >
      {isBookMarked ? "Remove Bookmark" : "Add Bookmark"}
      <CiBookmark className="inline-block text-xl mx-1" />
    </button>
  );
}
