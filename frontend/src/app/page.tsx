import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: '🔬',
    title: 'Lab Reports',
    description: 'Understand blood tests, urine analysis, and pathology reports in plain language',
  },
  {
    icon: '🩻',
    title: 'Scan & X-ray',
    description: 'CT scans, X-rays, MRIs, and DICOM images analyzed and explained clearly',
  },
  {
    icon: '💊',
    title: 'Prescriptions',
    description: 'Decode handwritten prescriptions with medicine names, dosages, and schedules',
  },
  {
    icon: '🌐',
    title: '4 Languages',
    description: 'Get explanations in English, Telugu, Hindi, or Tamil',
  },
  {
    icon: '🎤',
    title: 'Voice Input',
    description: 'Speak your symptoms or describe your document for instant analysis',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data is encrypted and only you can access your medical history',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            ✨ AI-Powered Medical Understanding
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Understand Your Medical<br />
            <span className="text-teal-500">Reports Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Upload your lab reports, prescriptions, or medical documents and get clear, 
            personalized explanations in your language.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Start Free →
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 dark:border-gray-600 hover:border-teal-500 text-gray-700 dark:text-gray-300 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-teal-500 dark:bg-teal-600 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to understand your health?</h2>
          <p className="text-teal-100 mb-8">Join thousands of patients understanding their medical reports</p>
          <Link
            href="/signup"
            className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
