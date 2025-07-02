"use client";

import Link from "next/link";
import { RiMenuFold2Fill, RiArrowDropDownLine } from "react-icons/ri";
import { VscClose } from "react-icons/vsc";
import { CiBookmark } from "react-icons/ci";
import { FaStaylinked } from "react-icons/fa6";
import { useState } from "react";
import SearchBar from "@/components/search-bar";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const baseLinkStyles =
    "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-600";

  return (
    <nav className="fixed md:block top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="w-full flex items-center justify-between h-16 px-2 sm:px-6">
        {/* Logo */}
        <Link href="/" className="hidden md:flex items-center space-x-1 text-2xl font-extrabold">
          <span>PC</span>
          <FaStaylinked className="text-orange-500" />
          <span className="text-orange-500">Linker</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/" className={baseLinkStyles}>
            Home
          </Link>
          <Link href="/pc-selection" className={baseLinkStyles}>
            PC Selection
          </Link>
          <Link href="/pc-builder" className={baseLinkStyles}>
            PC Builder
          </Link>

          {/* Components dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`${baseLinkStyles} flex items-center`}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
            >
              Components
              <RiArrowDropDownLine
                className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                <Link
                  href="/components/cpu"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-t-md"
                >
                  CPU
                </Link>
                <Link
                  href="/components/gpu"
                  className="block px-4 py-2 text-sm hover:bg-gray-50 rounded-b-md"
                >
                  GPU
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger + Bookmark */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <button
            className="md:hidden flex justify-center items-center p-2 size-10 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <VscClose className="text-xl"/> : <RiMenuFold2Fill className="text-xl"/>}
          </button>

          <SearchBar/>


          <Link href="/bookmarks" aria-label="Bookmarks">
            <CiBookmark className="text-2xl hover:text-orange-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <div className="flex flex-col space-y-1 px-4 py-3">
            {["Home", "PC Selection", "PC Builder", "CPU", "GPU"].map((label) => {
              const href = label === "Home"
                ? "/"
                : label === "CPU"
                ? "/components/cpu"
                : label === "GPU"
                ? "/components/gpu"
                : `/${label.toLowerCase().replace(" ", "-")}`;
              return (
                <Link
                  key={label}
                  href={href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
