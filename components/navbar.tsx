"use client"

import Link from "next/link";
import { RiMenuFold2Fill } from "react-icons/ri";
import { VscClose } from "react-icons/vsc";
import { useState } from "react";

export default function NavBar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between px-5 items-center border-b h-15 fixed w-full z-50">

      {/* Wide Screen Navigation */}
      <div className="hidden md:flex">
        <Link href="/" className="hover:border-b-2">My E-Commerce</Link>
      </div>
      <div className="hidden md:flex gap-4">
        <Link href="/" className="navbtn">Home</Link>
        <Link href="/pc-selections" className="navbtn">PC Selections</Link>
        <Link href="/components" className="navbtn">Components</Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button className="text-2xl cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <VscClose /> : <RiMenuFold2Fill/>}
        </button>
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 bg-[#FAFAFA] w-full shadow-lg p-4">
            <Link href="/" className="block py-2 hover:border-b-2">Home</Link>
            <Link href="/pc-selections" className="block py-2 hover:border-b-2">PC Selections</Link>
            <Link href="/components" className="block py-2 hover:border-b-2">Components</Link>
          </div>
        )}
      </div>
      <div>
        <Link href="/cart" className="hover:border-b-2">Cart</Link>
      </div>

    </nav>
  );
}
