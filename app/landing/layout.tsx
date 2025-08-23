import LandingNavigation from '@/components/landing/LandingNavigation'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      <LandingNavigation />
      <main className="pt-16">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-nebachiv-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold text-white">Nebachiv</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Українська платформа навчання безпечної їзди на мотоциклі. 
                Зменшуємо кількість аварій через освіту та тренування.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Навігація</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Головна</a></li>
                <li><a href="/pages" className="text-gray-400 hover:text-white transition-colors">База знань</a></li>
                <li><a href="/pages/nebachiv" className="text-gray-400 hover:text-white transition-colors">Про проект</a></li>
                <li><a href="/landing/promo" className="text-gray-400 hover:text-white transition-colors">Приєднатися</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Лендінги</h3>
              <ul className="space-y-2">
                <li><a href="/landing/nebachiv" className="text-gray-400 hover:text-white transition-colors">Nebachiv</a></li>
                <li><a href="/landing/rideicon" className="text-gray-400 hover:text-white transition-colors">Rideicon</a></li>
                <li><a href="/landing/modern2025" className="text-gray-400 hover:text-white transition-colors">Modern 2025</a></li>
                <li><a href="/landing/apple" className="text-gray-400 hover:text-white transition-colors">Apple Style</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Nebachiv. Всі права захищені. Зроблено для безпеки мотоциклістів України.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}