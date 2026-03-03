'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AdminRoute from '@/components/AdminRoute';
import HistoryCard from '@/components/HistoryCard';
import { adminAPI } from '@/lib/api';
import { Document } from '@/types';

export default function AdminPage() {
  return (
    <AdminRoute>
      <Admin />
    </AdminRoute>
  );
}

function Admin() {
  type UserRecord = {
    id: string;
    name: string;
    email: string;
    medId: string;
    role: string;
    documentCount: number;
    createdAt: string;
  };

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchMedId, setSearchMedId] = useState('');
  const [searchResult, setSearchResult] = useState<UserRecord | null>(null);
  const [searchDocs, setSearchDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    adminAPI.listUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchMedId.trim()) return;
    
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    setSearchDocs([]);
    
    try {
      const userRes = await adminAPI.searchByMedId(searchMedId.trim());
      setSearchResult(userRes.data);
      
      const docsRes = await adminAPI.getUserDocuments(searchMedId.trim());
      setSearchDocs(docsRes.data);
    } catch {
      setSearchError('User not found');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h1>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Search by MedID</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchMedId}
              onChange={(e) => setSearchMedId(e.target.value.toUpperCase())}
              placeholder="e.g. GUT491"
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 text-sm mt-3">{searchError}</p>
          )}

          {searchResult && (
            <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div><p className="text-xs text-gray-500">Name</p><p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.name}</p></div>
                <div><p className="text-xs text-gray-500">MedID</p><p className="font-mono font-medium text-teal-600">{searchResult.medId}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.email}</p></div>
                <div><p className="text-xs text-gray-500">Documents</p><p className="font-medium text-gray-800 dark:text-gray-200">{searchResult.documentCount}</p></div>
              </div>
              {searchDocs.length > 0 && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents:</p>
                  {searchDocs.map((doc) => (
                    <HistoryCard key={doc.id} doc={doc} isAdmin />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* All Users */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">All Users</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="text-left p-3 text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left p-3 text-gray-600 dark:text-gray-400">MedID</th>
                    <th className="text-left p-3 text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left p-3 text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left p-3 text-gray-600 dark:text-gray-400">Docs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-3 text-gray-800 dark:text-gray-200">{user.name}</td>
                      <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{user.medId}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{user.documentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
