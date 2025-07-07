import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-orange-600 text-white p-4 flex justify-between">
        <p>&copy; {new Date().getFullYear()} PC Linker. All rights reserved.</p>
        <div>
            <Link href="/tos" className="inline-block text-base hover:border-b hover:border-white mx-4">Terms and Services</Link>
            <Link href="/privacy" className="inline-block text-base hover:border-b hover:border-white mx-4">Privacy Policy</Link>
        </div>
    </footer>
  );
}
