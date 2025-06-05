export default function SpecificationNav({
  sections,
  activeSection,
}: {
  sections: string[];
  activeSection: string;
}) {
  return (
    <nav className="fixed top-[25%] z-10 mx-5 rounded-lg hidden lg:block">
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className={`block px-3 py-1 transition-colors duration-200 ${
                activeSection === section
                  ? "border-b border-orange-600 text-orange-600 font-medium"
                  : "hover:border-b hover:border-orange-600 hover:text-orange-600 text-gray-700 font-normal"
              }`}
            >
              {section}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
