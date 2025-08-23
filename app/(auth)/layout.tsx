import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-nebachiv-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-2xl font-bold text-white">Nebachiv</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-700">
          {children}
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-6 text-center">
        <Link 
          href="/" 
          className="text-sm text-gray-400 hover:text-nebachiv-400 transition-colors"
        >
          ← Повернутися на головну
        </Link>
      </div>
    </div>
  )
}