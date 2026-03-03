'use client';
import { INPUT_MODES } from '@/lib/constants';

interface InputModeSelectorProps {
  selected: string;
  onChange: (mode: string) => void;
}

export default function InputModeSelector({ selected, onChange }: InputModeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {INPUT_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
            selected === mode.id
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-teal-300'
          }`}
        >
          <span className="text-2xl">{mode.icon}</span>
          <span className="text-sm font-medium">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
