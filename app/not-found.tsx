import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-12 h-12 text-blue-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Сторінку не знайдено
          </h2>
          
          <p className="text-gray-600 mb-8">
            На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            На головну
          </Link>
          
          <Link
            href="/courses"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Переглянути курси
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Можливі причини:</p>
          <ul className="mt-2 space-y-1">
            <li>• Неправильно введена адреса</li>
            <li>• Сторінка була видалена або переміщена</li>
            <li>• Тимчасова технічна проблема</li>
          </ul>
        </div>
      </div>
    </div>
  )
}