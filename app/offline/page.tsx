'use client'

import { WifiOff, RefreshCw, BookOpen, User } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Ви офлайн</h1>
        <p className="text-gray-600 mb-8">
          Схоже, з'єднання з інтернетом втрачено. Але не хвилюйтесь, ви можете продовжити роботу з доступними офлайн матеріалами.
        </p>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Спробувати знову
          </button>
          
          <a
            href="/dashboard"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Мої курси (офлайн)
          </a>
          
          <a
            href="/profile"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <User className="w-5 h-5" />
            Мій профіль
          </a>
        </div>
        
        <div className="text-sm text-gray-500">
          <p className="mb-2">Доступні офлайн:</p>
          <ul className="space-y-1">
            <li>• Завантажені уроки</li>
            <li>• Збережені тести</li>
            <li>• Ваш прогрес</li>
          </ul>
          <p className="mt-4">Всі зміни синхронізуються після відновлення з'єднання</p>
        </div>
      </div>
    </div>
  )
}