'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Document } from '@/types';
import { documentsAPI, adminAPI } from '@/lib/api';

interface HistoryCardProps {
  doc: Document;
  isAdmin?: boolean;
}

const INPUT_ICONS: Record<string, string> = {
  text: '📝',
  file: '📁',
  voice: '🎤',
};

export default function HistoryCard({ doc, isAdmin }: HistoryCardProps) {
  const [downloadError, setDownloadError] = useState('');

  const handleDownload = async () => {
    setDownloadError('');
    try {
      const response = isAdmin
        ? await adminAPI.downloadFile(doc.id)
        : await documentsAPI.downloadFile(doc.id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      setDownloadError('File not available for download');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl">{INPUT_ICONS[doc.inputType] || '📄'}</div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{doc.inputType} Input</p>
            {doc.fileName && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{doc.fileName}</p>}
            <p className="text-xs text-gray-400">{formatDate(doc.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {doc.inputType === 'file' && doc.fileName && (
            <button
              onClick={handleDownload}
              className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              PDF
            </button>
          )}
          <Link
            href={`/result/${doc.id}`}
            className="text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            View Full
          </Link>
        </div>
      </div>
      {downloadError && (
        <p className="text-xs text-red-500 mt-2">{downloadError}</p>
      )}
    </div>
  );
}
