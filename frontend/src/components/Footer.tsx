export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ⚠️ <strong>Medical Disclaimer:</strong> MedPrompt is for informational purposes only. 
          Always consult with qualified healthcare professionals for medical advice and treatment decisions.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          © {new Date().getFullYear()} MedPrompt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
