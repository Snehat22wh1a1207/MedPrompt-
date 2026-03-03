'use client';
import { LANGUAGES } from '@/lib/constants';

interface LanguageSelectorProps {
  selected: string;
  onChange: (code: string) => void;
}

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
            selected === lang.code
              ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-300'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
