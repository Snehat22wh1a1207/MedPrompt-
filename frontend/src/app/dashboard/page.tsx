'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Disclaimer from '@/components/Disclaimer';
import LanguageSelector from '@/components/LanguageSelector';
import InputModeSelector from '@/components/InputModeSelector';
import TextInput from '@/components/TextInput';
import FileUpload from '@/components/FileUpload';
import VoiceInput from '@/components/VoiceInput';
import LoadingProgress from '@/components/LoadingProgress';
import { useAuthStore } from '@/store/authStore';
import { documentsAPI } from '@/lib/api';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [language, setLanguage] = useState('en');
  const [inputMode, setInputMode] = useState('text');
  const [textValue, setTextValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voiceText, setVoiceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('language', language);
      formData.append('inputType', inputMode);

      if (inputMode === 'text' && textValue) {
        formData.append('text', textValue);
      } else if (inputMode === 'file' && selectedFile) {
        formData.append('file', selectedFile);
        formData.append('inputType', 'file');
      } else if (inputMode === 'voice' && voiceText) {
        formData.append('text', voiceText);
      } else {
        setError('Please provide input before analyzing');
        setLoading(false);
        return;
      }

      const res = await documentsAPI.analyze(formData);
      router.push(`/result/${res.data.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || 'Analysis failed');
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hello, {firstName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            MedID: <span className="text-teal-600 dark:text-teal-400 font-mono font-semibold">{user?.medId}</span>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
          {/* Language */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Output Language</p>
            <LanguageSelector selected={language} onChange={setLanguage} />
          </div>

          {/* Input mode */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Input Mode</p>
            <InputModeSelector selected={inputMode} onChange={setInputMode} />
          </div>

          {/* Input area */}
          <div>
            {inputMode === 'text' && (
              <TextInput value={textValue} onChange={setTextValue} />
            )}
            {inputMode === 'file' && (
              <FileUpload onFile={setSelectedFile} selectedFile={selectedFile} />
            )}
            {inputMode === 'voice' && (
              <VoiceInput onTranscript={setVoiceText} language={language} />
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingProgress />
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-lg transition-colors"
            >
              🔍 Analyze Document
            </button>
          )}
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
