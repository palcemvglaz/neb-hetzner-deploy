'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuestionnaireSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Оберіть тип анкети</h1>
          <p className="text-gray-400">Виберіть варіант, який найкраще описує ваш досвід</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Beginner Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => router.push('/q/beginner')}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-900/50 rounded-full mb-4 mx-auto">
              <span className="text-3xl">🏍️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 text-center">Початківець</h2>
            <p className="text-gray-400 text-sm text-center mb-4">
              Для тих, хто тільки починає або має досвід до 1 року
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ще не маю мотоцикла</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>В мотошколі або щойно закінчив</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Їжджу менше року</span>
              </li>
            </ul>
          </motion.div>

          {/* Experienced Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-orange-500 transition-all cursor-pointer"
            onClick={() => router.push('/q/experienced')}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-orange-900/50 rounded-full mb-4 mx-auto">
              <span className="text-3xl">🏁</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 text-center">Досвідчений</h2>
            <p className="text-gray-400 text-sm text-center mb-4">
              Для тих, хто їздить більше року
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Їжджу більше року</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Маю кілька мотоциклів</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Їжджу в далекі подорожі</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Не впевнені? Почніть з анкети для початківців
          </p>
        </div>
      </motion.div>
    </div>
  )
}