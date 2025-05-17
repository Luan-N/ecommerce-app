import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div>
        <Link href="/">My E-Commerce</Link>
      </div>
    </nav>
  );
}
