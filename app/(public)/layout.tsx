import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company info */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-nebachiv-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold">Nebachiv</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Сучасна платформа для навчання безпечній їзді на мотоциклі з інтерактивними курсами та персональним відстеженням прогресу.
              </p>
              <div className="flex space-x-4">
                {/* Social links можна додати пізніше */}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-semibold mb-4">Швидкі посилання</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/guides" className="hover:text-white transition-colors">Гайди</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Про нас</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Тарифи</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Контакти</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Підтримка</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Допомога</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Конфіденційність</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Умови</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Nebachiv. Всі права захищені.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Зроблено з ❤️ в Україні
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}