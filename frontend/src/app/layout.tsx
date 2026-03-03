import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedPrompt - Understand Your Medical Reports Instantly',
  description: 'AI-powered medical document analysis in plain language',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
