'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import OverviewTab from '@/components/OverviewTab';
import SummaryTab from '@/components/SummaryTab';
import Disclaimer from '@/components/Disclaimer';
import { documentsAPI } from '@/lib/api';
import { Document } from '@/types';

export default function ResultPage() {
  return (
    <ProtectedRoute>
      <Result />
    </ProtectedRoute>
  );
}

function Result() {
  const { id } = useParams();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'summary'>('overview');
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (id) {
      documentsAPI.getDocument(id as string)
        .then((res) => setDoc(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCopy = () => {
    if (!doc) return;
    const text = activeTab === 'overview'
      ? JSON.stringify(doc.overview, null, 2)
      : doc.summary || '';
    navigator.clipboard.writeText(text);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!doc) return;
    import('jspdf').then(({ default: jsPDF }) => {
      const pdf = new jsPDF();
      let y = 20;

      pdf.setFontSize(20);
      pdf.setTextColor(13, 148, 136);
      pdf.text('MedPrompt Analysis Report', 20, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`MedID: ${doc.medId || ''}`, 20, y);
      y += 6;
      pdf.text(`Date: ${doc.createdAt ? new Date(doc.createdAt).toLocaleString() : ''}`, 20, y);
      y += 6;
      pdf.text(`Input Type: ${doc.inputType}`, 20, y);
      y += 12;

      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text('Overview', 20, y);
      y += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(60);
      const overviewText = JSON.stringify(doc.overview, null, 2);
      const overviewLines = pdf.splitTextToSize(overviewText, 170);
      overviewLines.forEach((line: string) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.text(line, 20, y);
        y += 5;
      });

      y += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text('Summary', 20, y);
      y += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(60);
      const summaryLines = pdf.splitTextToSize(doc.summary || '', 170);
      summaryLines.forEach((line: string) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.text(line, 20, y);
        y += 5;
      });

      pdf.save(`MedPrompt-Report-${doc.medId || id}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Result</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {copyDone ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-teal-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 rounded-xl font-semibold transition-colors ${
              activeTab === 'summary'
                ? 'bg-teal-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            Summarization
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          {activeTab === 'overview' ? (
            <OverviewTab overview={doc.overview || {}} />
          ) : (
            <SummaryTab summary={doc.summary || ''} />
          )}
        </div>

        <Disclaimer />
      </main>
    </div>
  );
}
