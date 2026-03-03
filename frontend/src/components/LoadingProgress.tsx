'use client';
import { useState, useEffect } from 'react';

const messages = [
  'Extracting text…',
  'Analyzing medical data…',
  'Generating explanation…',
];

export default function LoadingProgress() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      <p className="text-gray-600 dark:text-gray-300 animate-pulse">{messages[msgIdx]}</p>
    </div>
  );
}
