'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import HistoryCard from '@/components/HistoryCard';
import { documentsAPI } from '@/lib/api';
import { Document } from '@/types';

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  );
}

function History() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentsAPI.history()
      .then((res) => setDocs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analysis History</h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p>No analysis history yet. Go to Dashboard to analyze your first document.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <HistoryCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
