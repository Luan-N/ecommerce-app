"use client";

export default function PcBuilderFormInput({
  label,
  id,
  name,
  placeholder,
  required = false,
}: {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label htmlFor={id} className="text-sm">
        {label}:
      </label>
      <input
        className="text-sm w-65 border rounded-sm border-gray-300 p-1 focus:bg-accent outline-none"
        type="text"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}