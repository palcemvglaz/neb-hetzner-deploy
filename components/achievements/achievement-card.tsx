'use client'

import { useState } from 'react'
import { Trophy, Star, Clock, Target } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'

interface AchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    type: string
    progress: number
    unlockedAt: Date | null
    achievement?: {
      icon: string
      points: number
      rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
      category: string
    }
    points?: number
    rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
    category?: string
  }
  size?: 'small' | 'medium' | 'large'
  showDetails?: boolean
}

export function AchievementCard({ 
  achievement, 
  size = 'medium',
  showDetails = true 
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const isUnlocked = achievement.unlockedAt !== null
  const icon = achievement.achievement?.icon || '🏆'
  const points = achievement.achievement?.points || achievement.points || 0
  const rarity = achievement.achievement?.rarity || achievement.rarity || 'COMMON'
  const category = achievement.achievement?.category || achievement.category || 'Загальне'

  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  }

  const iconSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl'
  }

  const rarityColors = {
    COMMON: 'border-gray-300 bg-gray-50',
    RARE: 'border-blue-300 bg-blue-50',
    EPIC: 'border-purple-300 bg-purple-50',
    LEGENDARY: 'border-yellow-300 bg-yellow-50'
  }

  const rarityTextColors = {
    COMMON: 'text-gray-600',
    RARE: 'text-blue-600',
    EPIC: 'text-purple-600',
    LEGENDARY: 'text-yellow-600'
  }

  const rarityNames = {
    COMMON: 'Звичайне',
    RARE: 'Рідкісне',
    EPIC: 'Епічне',
    LEGENDARY: 'Легендарне'
  }

  return (
    <div 
      className={`
        relative rounded-lg border-2 transition-all duration-300 cursor-pointer
        ${isUnlocked 
          ? `${rarityColors[rarity]} hover:shadow-lg ${isHovered ? 'scale-105' : ''}`
          : 'border-gray-200 bg-gray-100 opacity-60'
        }
        ${sizeClasses[size]}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rarity indicator */}
      {isUnlocked && rarity !== 'COMMON' && (
        <div className="absolute -top-2 -right-2">
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
            ${rarity === 'RARE' ? 'bg-blue-500' : 
              rarity === 'EPIC' ? 'bg-purple-500' : 'bg-yellow-500'}
          `}>
            <Star className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Achievement Icon */}
      <div className="flex items-center justify-center mb-3">
        <span className={`${iconSizes[size]} ${isUnlocked ? '' : 'grayscale'}`}>
          {icon}
        </span>
      </div>

      {/* Achievement Info */}
      <div className="text-center">
        <h3 className={`
          font-semibold mb-1
          ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'}
          ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}
        `}>
          {achievement.title}
        </h3>
        
        <p className={`
          text-xs text-gray-600 mb-2 line-clamp-2
          ${!isUnlocked ? 'text-gray-400' : ''}
        `}>
          {achievement.description}
        </p>

        {showDetails && (
          <div className="space-y-2">
            {/* Points and Rarity */}
            <div className="flex items-center justify-center gap-3 text-xs">
              {points > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  <span className="font-medium">{points} балів</span>
                </div>
              )}
              
              <div className={`font-medium ${rarityTextColors[rarity]}`}>
                {rarityNames[rarity]}
              </div>
            </div>

            {/* Category */}
            <div className="text-xs text-gray-500">
              {category}
            </div>

            {/* Unlock date or progress */}
            {isUnlocked ? (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(achievement.unlockedAt!), {
                    addSuffix: true,
                    locale: uk
                  })}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <Target className="w-3 h-3" />
                <span>Заблоковано</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      {isUnlocked && isHovered && (
        <div className="absolute inset-0 bg-white bg-opacity-20 rounded-lg pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  )
}

interface AchievementToastProps {
  achievement: {
    title: string
    description: string
    icon: string
    points: number
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  }
  onClose: () => void
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const rarityColors = {
    COMMON: 'border-gray-300 bg-gray-50',
    RARE: 'border-blue-300 bg-blue-50',
    EPIC: 'border-purple-300 bg-purple-50',
    LEGENDARY: 'border-yellow-300 bg-yellow-50'
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      border-2 rounded-lg shadow-lg p-4 animate-slide-in-right
      ${rarityColors[achievement.rarity]}
    `}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">Нове досягнення!</h4>
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Trophy className="w-3 h-3" />
              <span>+{achievement.points}</span>
            </div>
          </div>
          <p className="font-medium text-gray-800">{achievement.title}</p>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}