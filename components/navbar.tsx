"use client";

import Link from "next/link";
import Image from "next/image";
import { RiMenuFold2Fill } from "react-icons/ri";
import { VscClose } from "react-icons/vsc";
import { CiBookmark } from "react-icons/ci";
import { FaStaylinked } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState } from "react";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 bg-white flex justify-between px-5 items-center border-b h-15 w-full">
      {/* Wide Screen Navigation */}
      <Link href="/" className="hidden md:flex text-2xl font-bold">
        PC
        <FaStaylinked className="inline-block text-orange-500" />
        <span className="text-orange-500">
          Linker
        </span>
      </Link>
      
      <div className="hidden md:flex gap-4">
        <Link href="/" className="navbtn">
          Home
        </Link>
        <Link href="/pc-selection" className="navbtn">
          PC Selection
        </Link>
        <Link href="/pc-builder" className="navbtn">
          PC Builder
        </Link>
        <div
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            className="navbtn"
            aria-label="toggle dropdown menu"
            aria-expanded={isDropdownOpen}
            aria-controls="dropdown-menu"
          >
            Components
            <RiArrowDropDownLine
              className={`inline-block text-2xl ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white rounded-sm shadow-lg border-1 p-2" id="dropdown-menu">
              <Link href="/cpu" className="navbtn block">
                Central Processing Unit (CPU)
              </Link>
              <Link href="/gpu" className="navbtn block">
                Graphical Processing Unit (GPU)
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <button
        className="text-2xl cursor-pointer md:hidden navbtn active"
        aria-label="toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <VscClose /> : <RiMenuFold2Fill />}
      </button>
      {isMobileMenuOpen && (
        <div
          className="absolute top-16 left-0 bg-white w-full shadow-lg p-4"
          id="mobile-menu"
        >
          <Link href="/" className="block py-2 hover:border-b-2">
            Home
          </Link>
          <Link href="/pc-selection" className="block py-2 hover:border-b-2">
            PC Selection
          </Link>
          <Link href="/pc-builder" className="block py-2 hover:border-b-2">
            PC Builder
          </Link>
          <Link href="/cpu" className="block py-2 hover:border-b-2">
            Central Processing Unit(CPU)
          </Link>
          <Link href="/gpu" className="block py-2 hover:border-b-2">
            Graphical Processing Unit(GPU)
          </Link>
        </div>
      )}
      <Link href="/bookmarks" className="" aria-label="bookmarks">
        <CiBookmark className="text-2xl hover:text-orange-500" />
      </Link>
    </nav>
  );
}
