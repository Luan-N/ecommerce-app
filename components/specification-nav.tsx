"use client";

import { useEffect, useState, useRef } from "react";

export default function SpecificationNav({ sections = [] }: { sections: string[] }) {
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionEntriesMap = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Top: 20% down, Bottom: 79% up (leaves 1% height in the middle)
      threshold: 0, // Trigger callback as soon as any part of the target enters/exits the rootMargin
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        sectionEntriesMap.current.set(entry.target.id, entry);
      });

      let currentBestCandidateId = "";
      let closestToViewportTop = Infinity;

      for (const sectionId of sections) {
        const entry = sectionEntriesMap.current.get(sectionId);

        if (entry && entry.isIntersecting) {
          if (entry.boundingClientRect.top < closestToViewportTop) {
            currentBestCandidateId = sectionId;
            closestToViewportTop = entry.boundingClientRect.top;
          }
        }
      }

      if (!currentBestCandidateId) {
        if (window.scrollY < 50 && sections.length > 0) 
          currentBestCandidateId = sections[0];
        else 
          currentBestCandidateId = activeSection; 
      }

      if (activeSection !== currentBestCandidateId) 
        setActiveSection(currentBestCandidateId);
    };

    observerRef.current = new IntersectionObserver(handleIntersect, observerOptions);

    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null); 

    elements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, activeSection]);

  return (
    <nav className="fixed top-[25%] left-0 z-10 mx-5 rounded-lg hidden lg:block">
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className={`block px-3 py-1 transition-colors duration-200 rounded-md
                ${activeSection === section
                  ? "border-b border-orange-600 text-orange-600 font-medium bg-orange-50" // Active style
                  : "hover:border-b hover:border-orange-600 hover:text-orange-600 text-gray-700 font-normal hover:bg-gray-100" // Inactive style
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
