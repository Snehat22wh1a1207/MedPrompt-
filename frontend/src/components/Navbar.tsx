'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, logout, loadFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">MedPrompt</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  {user.name} · <span className="text-teal-600 dark:text-teal-400 font-mono">{user.medId}</span>
                </span>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
                >
                  History
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-4 py-1.5 rounded-lg hover:border-teal-500 hover:text-teal-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 px-4 py-1.5 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
