"use client";

import { useRef, useState } from "react";

export default function PcBuilder() {
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Convert to a plain object:
    const formData = Object.fromEntries(form.entries());

    const prompt =
      JSON.stringify(formData) +
      "\nCheck compatibility of these components. If they are compatible, return a score from 0 to 100 at the end of the response. If they are not compatible, return a score of 0 and explain why they are not compatible.";

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: prompt,
    });
    const data = await response.text();
    setText(data);
    // handle response…
  }

  return (
    <form onSubmit={handleSubmit} className="mt-25">
      <fieldset>
        <legend className="font-semibold text-lg text-orange-800 uppercase">
          CPU
        </legend>

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="cpu" className="text-sm">
            CPU Model:
          </label>
          <input
            className="text-sm w-50 border rounded-sm border-gray-300 p-1 focus:bg-accent outline-none"
            type="text"
            id="cpu"
            name="cpu"
            placeholder="Intel Core i7-12700K"
            required
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-semibold text-lg text-orange-800 uppercase">
          Motherboard
        </legend>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="motherboard" className="text-sm">
            Motherboard Model:
          </label>
          <input
            className="text-sm w-50 border rounded-sm border-gray-300 p-1 focus:bg-accent outline-none"
            type="text"
            id="motherboard"
            name="motherboard"
            placeholder="ASUS ROG Strix Z690-E"
            required
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="motherboard-socket" className="text-sm">
            CPU Socket:
          </label>
          <input
            className="text-sm w-50 border rounded-sm border-gray-300 p-1 focus:bg-accent outline-none"
            type="text"
            id="motherboard-socket"
            name="motherboard-socket"
            placeholder="LGA 1700, AM5"
            required
          />
        </div>
      </fieldset>

      {/* Repeat the pattern for GPU, Storage, PSU, etc. */}
      <button type="submit">Check Compatibility</button>
    </form>
  );
}
