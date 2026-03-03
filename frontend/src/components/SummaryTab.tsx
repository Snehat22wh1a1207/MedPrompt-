'use client';

interface SummaryTabProps {
  summary: string;
}

export default function SummaryTab({ summary }: SummaryTabProps) {
  if (!summary) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No summary available.</p>
    );
  }

  // Convert markdown-like formatting
  const lines = summary.split('\n');

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-gray-800 dark:text-gray-100">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="text-gray-700 dark:text-gray-300 ml-4">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
