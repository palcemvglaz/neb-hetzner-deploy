'use client'

import { Trophy, Star, Target, Zap, BookOpen, Clock } from 'lucide-react'

interface AchievementBadgeProps {
  type: string
  title: string
  description: string
  isUnlocked: boolean
  progress?: number
  maxProgress?: number
  icon?: string
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  target: Target,
  zap: Zap,
  book: BookOpen,
  clock: Clock
}

export default function AchievementBadge({
  type,
  title,
  description,
  isUnlocked,
  progress = 0,
  maxProgress = 1,
  icon = 'trophy'
}: AchievementBadgeProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Trophy
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0

  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all duration-200
      ${isUnlocked 
        ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
        : 'border-gray-200 bg-gray-50'
      }
    `}>
      {/* Achievement Icon */}
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto
        ${isUnlocked 
          ? 'bg-yellow-100 text-yellow-600' 
          : 'bg-gray-100 text-gray-400'
        }
      `}>
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Achievement Info */}
      <div className="text-center">
        <h3 className={`
          font-semibold text-sm mb-1
          ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}
        `}>
          {title}
        </h3>
        
        <p className={`
          text-xs mb-3
          ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}
        `}>
          {description}
        </p>

        {/* Progress Bar (for achievements in progress) */}
        {!isUnlocked && maxProgress > 1 && (
          <div className="space-y-1">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-nebachiv-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {progress} / {maxProgress}
            </p>
          </div>
        )}

        {/* Unlocked Badge */}
        {isUnlocked && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
              ✓ Здобуто
            </div>
          </div>
        )}
      </div>
    </div>
  )
}