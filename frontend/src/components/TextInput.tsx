'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
      placeholder="Paste your medical report text here... e.g., lab values, doctor notes, prescription details, symptoms..."
    />
  );
}
