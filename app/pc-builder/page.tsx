"use client";

import ReactMarkDown from "react-markdown";
import { useState } from "react";
import PcBuilderFormInput from "@/components/pc-builder-form-input";

export default function PcBuilder() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("manual");
  const [responseVisible, setResponseVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setText("");
    setResponseVisible(true);
    const form = new FormData(e.currentTarget);
    // Convert to a plain object:
    const formData = Object.fromEntries(form.entries());
    console.log("Form Data:", formData);

    const prompt =
      JSON.stringify(formData) +
      "\nCheck compatibility of these components. If they are compatible, return a score from 0 to 100 at the end of the response. If they are not compatible, return a score of 0 and explain why they are not compatible.";

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json()
    setText(data);
  }

  return (
    <main className="mt-25 m-5 md:m-15 lg:m-20 flex justify-center items-start flex-col md:flex-row gap-5">
      {/* Form */}
      <section className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between border-b space-x-1">
          <div className="flex items-center p-1 my-1 rounded-sm bg-accent">
            <button
              className={`py-1 px-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === "manual" && "bg-white text-black shadow"
              }`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Input
            </button>
            <button
              className={`py-1 px-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === "auto" && "bg-white text-black shadow"
              }`}
              onClick={() => setActiveTab("auto")}
            >
              Input via URL
            </button>
          </div>
          <button type="submit" className="hidden sm:block py-1 px-4 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer">
            Check Compatibility
          </button>
        </div>
          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">
              CPU
            </legend>

            <PcBuilderFormInput
              label="CPU Model"
              id="cpu"
              name="cpu"
              placeholder="Intel Core i7-12700K"
              required
            />
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">
              Graphics Card (GPU)
            </legend>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="GPU Model"
                id="gpu-model"
                name="gpu-model"
                placeholder="NVIDIA GeForce RTX 3080"
                required
              />
              <PcBuilderFormInput
                label="VRAM"
                id="gpu-vram"
                name="gpu-vram"
                placeholder="10GB GDDR6X"
              />
              <PcBuilderFormInput
                label="Interface"
                id="gpu-interface"
                name="gpu-interface"
                placeholder="PCIe 4.0 x16"
              />
              <PcBuilderFormInput
                label="Power Connectors"
                id="gpu-power-connectors"
                name="gpu-power-connectors"
                placeholder="1x 8-pin, 1x 6-pin"
              />
              <PcBuilderFormInput
                label="Physical Dimensions"
                id="gpu-physical-dimensions"
                name="gpu-physical-dimensions"
                placeholder="Length x Width x Height"
              />
              <PcBuilderFormInput
                label="Display Outputs"
                id="gpu-display-outputs"
                name="gpu-display-outputs"
                placeholder="HDMI 2.0, DisplayPort 1.4a"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">
              Motherboard
            </legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="Motherboard Model"
                id="motherboard"
                name="motherboard"
                placeholder="ASUS ROG Strix Z690-E"
                required
              />
              <PcBuilderFormInput
                label="Memory Support"
                id="motherboard-memory"
                name="motherboard-memory"
                placeholder="DDR5 4800MHz EXPO Dual Channel"
              />
              <PcBuilderFormInput
                label="Motherboard Socket"
                id="motherboard-socket"
                name="motherboard-socket"
                placeholder="LGA 1700, AM4"
              />
              <PcBuilderFormInput
                label="PCIe Support"
                id="motherboard-pcie"
                name="motherboard-pcie"
                placeholder="PCIe 4.0 x4, PCIe 5.0 x16"
              />
              <PcBuilderFormInput
                label="NVMe/ SATA Support"
                id="nvme-sata"
                name="nvme-sata"
                placeholder="NVMe x2, SATA x4"
              />
              <PcBuilderFormInput
                label="Form Factor"
                id="motherboard-form-factor"
                name="motherboard-form-factor"
                placeholder="ATX, Micro-ATX, Mini-ITX"
              />
              <PcBuilderFormInput
                label="Power Connectors"
                id="motherboard-power-connectors"
                name="motherboard-power-connectors"
                placeholder="4x 8-pin, 2x 4-pin"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">
              Memory(RAM)
            </legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <PcBuilderFormInput
              label="Memory Type"
              id="memory-type"
              name="memory-type"
              placeholder="DDR4, DDR5"
              required
            />
            <PcBuilderFormInput
              label="Capacity"
              id="memory-capacity"
              name="memory-capacity"
              placeholder="16GB(2x8), 32GB(2x16)"
            />
            <PcBuilderFormInput
              label="Speed"
              id="memory-speed"
              name="memory-speed"
              placeholder="3200MHz, 3600MHz"
            />
            <PcBuilderFormInput
              label="Form Factor"
              id="memory-form-factor"
              name="memory-form-factor"
              placeholder="DIMM, SO-DIMM"
              required
            />
            <PcBuilderFormInput
              label="Voltage"
              id="memory-voltage"
              name="memory-voltage"
              placeholder="1.2V, 1.35V"
            />
            <PcBuilderFormInput
              label="Memory Profile"
              id="memory-profile"
              name="memory-profile"
              placeholder="XMP, EXPO"
            />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">Storage</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="Storage Type"
                id="storage-type"
                name="storage-type"
                placeholder="HDD, SSD"
                required
              />
              <PcBuilderFormInput
                label="Capacity"
                id="storage-capacity"
                name="storage-capacity"
                placeholder="1TB, 2TB"
                required
              />
              <PcBuilderFormInput
                label="Form Factor"
                id="storage-form-factor"
                name="storage-form-factor"
                placeholder="2.5-inch, M.2"
                required
              />
              <PcBuilderFormInput
                label="Interface"
                id="storage-interface"
                name="storage-interface"
                placeholder="SATA, NVMe"
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">
              Power Supply (PSU)
            </legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="Form Factor"
                id="psu-form-factor"
                name="psu-form-factor"
                placeholder="ATX, SFX"
                required
              />
              <PcBuilderFormInput
                label="PSU Wattage"
                id="psu-wattage"
                name="psu-wattage"
                placeholder="650W, 750W"
                required
              />
              <PcBuilderFormInput
                label="Efficiency Rating"
                id="psu-efficiency"
                name="psu-efficiency"
                placeholder="80 Plus Bronze, Gold, Platinum"
              />
              <PcBuilderFormInput
                label="Modularity"
                id="psu-modularity"
                name="psu-modularity"
                placeholder="Non-Modular, Semi-Modular, Fully Modular"
              />
              <PcBuilderFormInput
                label="Connectors"
                id="psu-connectors"
                name="psu-connectors"
                placeholder="6x SATA, 2x PCIe, 1x 24-pin ATX"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">Case</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="Case Model"
                id="case-model"
                name="case-model"
                placeholder="NZXT H510, Corsair 4000D"
                required
              />
              <PcBuilderFormInput
                label="Form Factor"
                id="case-form-factor"
                name="case-form-factor"
                placeholder="ATX, Micro-ATX, Mini-ITX"
              />
              <PcBuilderFormInput
                label="Cooling Support"
                id="case-cooling-support"
                name="case-cooling-support"
                placeholder="120mm, 240mm AIO, Airflow Fans"
              />
              <PcBuilderFormInput
                label="Drive Bays"
                id="case-drive-bays"
                name="case-drive-bays"
                placeholder="2x 3.5-inch, 2x 2.5-inch"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-semibold text-lg text-orange-800 uppercase">CPU Cooler</legend>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <PcBuilderFormInput
                label="Cooler Model"
                id="cpu-cooler-model"
                name="cpu-cooler-model"
                placeholder="Noctua NH-D15, Corsair H100i"
                required
              />
              <PcBuilderFormInput
                label="Cooler Dimensions"
                id="cpu-cooler-dimensions"
                name="cpu-cooler-dimensions"
                placeholder="Length x Width x Height"
              />
              <PcBuilderFormInput
                label="Socket Compatibility"
                id="cpu-cooler-socket"
                name="cpu-cooler-socket"
                placeholder="LGA1200, AM4"
                required
              />
              <PcBuilderFormInput
                label="Cooling Type"
                id="cpu-cooler-type"
                name="cpu-cooler-type"
                placeholder="Air, Liquid"
                required
              />
              <PcBuilderFormInput
                label="RGB Lighting"
                id="cpu-cooler-rgb"
                name="cpu-cooler-rgb"
                placeholder="Yes, No"
              />
            </div>
          </fieldset>

          <div className="flex flex-col gap-2 mb-4 self-center">
            <label htmlFor="additional-information" className="text-sm font-semibold mt-4">
              Additional Information
            </label>
            <textarea className="text-sm w-full border rounded-sm border-gray-300 p-1 focus:bg-accent outline-none" name="additional-information" id="additional-information" placeholder="Any additional information or requirements"></textarea>
          </div>

          {/* Repeat the pattern for GPU, Storage, PSU, etc. */}
          <button type="submit" className="py-1 px-4 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer">Check Compatibility</button>
        </form>
      </section>
      {/* Response */}
      {responseVisible && (
        <section className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <div className="w-full max-w-2xl mt-8">
            <h2 className="text-lg p-1 font-semibold text-orange-800 mb-4 uppercase">
              Compatibility Report
            </h2>
            <div className={`p-4 bg-gray-50 rounded-sm ${!text && "bg-pulse"}`}>
              <ReactMarkDown >{text}</ReactMarkDown>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
