"use client";

import { get } from "http";
import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";

export default function Bookmark({
  product,
  productid,
}: {
  product: string;
  productid: string;
}) {
  const [isBookMarked, setIsBookMarked] = useState(false);

  function getBookmarks() {
    const bookmarksStr = localStorage.getItem("bookmarks");
    const bookmarks = bookmarksStr ? JSON.parse(bookmarksStr) : [];
    return bookmarks;
  }

  useEffect(() => {
    const bookmarks = getBookmarks();
    setIsBookMarked(bookmarks.includes(productid));
  }, [productid]);

  // Toggle function
  function toggleBookmark(itemId: string) {
    const bookmarks = getBookmarks();

    if (bookmarks.includes(itemId)) {
      // Remove bookmark
      const index = bookmarks.indexOf(itemId);
      bookmarks.splice(index, 1);
    } else {
      // Add bookmark
      console.log("Adding bookmark for:", itemId);
      bookmarks.push(itemId);
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setIsBookMarked(bookmarks.includes(itemId));
  }

  return (
    <button
      onClick={() => toggleBookmark(productid)}
      className={`w-full px-4 py-2 transition-colors cursor-pointer rounded ${isBookMarked ? "bg-white text-orange-600 hover:bg-orange-100 border border-orange-600" : "bg-orange-600 text-white hover:bg-orange-500 "}`}
    >
      {isBookMarked ? "Remove Bookmark" : "Add Bookmark"}
      <CiBookmark className="inline-block text-xl mx-1" />
    </button>
  );
}
