'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown, Check, AlertCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Motorcycle,
  searchMotorcycles,
  getPopularMotorcycles,
  categorizeForBeginner,
  MOTORCYCLES_DATABASE
} from '@/data/motorcycles-database'

interface MotorcycleAutocompleteProps {
  value?: string
  onChange: (motorcycle: Motorcycle | null) => void
  placeholder?: string
  required?: boolean
  showRecommendation?: boolean
  userExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  className?: string
}

export default function MotorcycleAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing brand or model...',
  required = false,
  showRecommendation = true,
  userExperience = 'beginner',
  className
}: MotorcycleAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Motorcycle[]>([])
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null)
  const [showPopular, setShowPopular] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get popular motorcycles
  const popularMotorcycles = useMemo(() => getPopularMotorcycles(5), [])

  // Search motorcycles when query changes
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = searchMotorcycles(searchQuery)
      setSearchResults(results)
      setShowPopular(false)
    } else {
      setSearchResults([])
      setShowPopular(true)
    }
  }, [searchQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (motorcycle: Motorcycle) => {
    setSelectedMotorcycle(motorcycle)
    setSearchQuery(motorcycle.fullName)
    setIsOpen(false)
    onChange(motorcycle)
  }

  const getRecommendationBadge = (motorcycle: Motorcycle) => {
    if (!showRecommendation || userExperience !== 'beginner') return null

    const category = categorizeForBeginner(motorcycle)
    
    switch (category) {
      case 'RECOMMENDED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-900/50 text-green-400">
            <Check className="w-3 h-3 mr-1" />
            Recommended
          </span>
        )
      case 'NOT_RECOMMENDED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900/50 text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Advanced
          </span>
        )
      default:
        return null
    }
  }

  const getMotorcycleIcon = (type: Motorcycle['type']) => {
    const icons: Record<Motorcycle['type'], string> = {
      naked: '🏍️',
      sport: '🏁',
      adventure: '🗺️',
      cruiser: '🛣️',
      touring: '🧳',
      supermoto: '🤸',
      classic: '🎩',
      scooter: '🛵'
    }
    return icons[type] || '🏍️'
  }

  const getEngineLabel = (size: number) => {
    if (size <= 125) return 'A1'
    if (size <= 400) return 'A2'
    return 'A'
  }

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={cn(
            "w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg",
            "text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200",
            className
          )}
        />
        <ChevronDown 
          className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4",
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {/* Selected Motorcycle Info */}
      {selectedMotorcycle && (
        <div className="mt-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Selected motorcycle:</p>
              <p className="font-medium text-white">{selectedMotorcycle.fullName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {getMotorcycleIcon(selectedMotorcycle.type)} {selectedMotorcycle.type}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{selectedMotorcycle.engineSize}cc</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{getEngineLabel(selectedMotorcycle.engineSize)}</span>
                {selectedMotorcycle.hasABS && (
                  <>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-green-400">ABS</span>
                  </>
                )}
              </div>
            </div>
            {getRecommendationBadge(selectedMotorcycle)}
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto"
        >
          {/* Popular Motorcycles Section */}
          {showPopular && popularMotorcycles.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Popular choices
              </p>
              {popularMotorcycles.map((moto) => (
                <button
                  key={moto.id}
                  onClick={() => handleSelect(moto)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium text-white group-hover:text-blue-400">
                          {moto.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {getMotorcycleIcon(moto.type)} {moto.type}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{moto.engineSize}cc</span>
                        {moto.hasABS && (
                          <>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-green-400">ABS</span>
                          </>
                        )}
                      </div>
                    </div>
                    {getRecommendationBadge(moto)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-2">
              {!showPopular && (
                <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Search results ({searchResults.length})
                </p>
              )}
              {searchResults.map((moto) => (
                <button
                  key={moto.id}
                  onClick={() => handleSelect(moto)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-white group-hover:text-blue-400">
                        {moto.fullName}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {getMotorcycleIcon(moto.type)} {moto.type}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{moto.engineSize}cc</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{moto.difficultyLevel}</span>
                        {moto.hasABS && (
                          <>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-green-400">ABS</span>
                          </>
                        )}
                      </div>
                    </div>
                    {getRecommendationBadge(moto)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!showPopular && searchResults.length === 0 && searchQuery.length > 1 && (
            <div className="p-4 text-center">
              <p className="text-gray-400">No motorcycles found</p>
              <p className="text-xs text-gray-500 mt-1">Try searching by brand or model</p>
            </div>
          )}

          {/* All Brands Quick Access */}
          {showPopular && (
            <div className="p-2 border-t border-gray-800">
              <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Browse by brand
              </p>
              <div className="grid grid-cols-3 gap-1 px-3">
                {Array.from(new Set(MOTORCYCLES_DATABASE.map(m => m.brand)))
                  .sort()
                  .slice(0, 12)
                  .map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSearchQuery(brand)}
                      className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    >
                      {brand}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}