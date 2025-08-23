'use client'

import React from 'react'
import { Profile3D } from '@/lib/questionnaire/profile-calculator-3d-simple'

interface Profile2DRadarProps {
  profile: Profile3D
  size?: 'small' | 'medium' | 'large'
}

export function Profile2DRadar({ profile, size = 'medium' }: Profile2DRadarProps) {
  const sizes = {
    small: 200,
    medium: 300,
    large: 400
  }
  
  const chartSize = sizes[size]
  const center = chartSize / 2
  const radius = chartSize * 0.35
  
  // Prepare data points
  const axes = [
    { label: 'Risk Taking', value: profile.riskTaking / 10, color: '#ef4444' },
    { label: 'Technical Skills', value: profile.technicalSkills / 10, color: '#22c55e' },
    { label: 'Self-Assessment', value: (profile.adequacy + 5) / 10, color: '#3b82f6' },
    { label: 'Safety Index', value: (profile.safetyIndex + 20) / 40, color: '#10b981' },
    { label: 'Growth Potential', value: profile.growthPotential / 10, color: '#8b5cf6' }
  ]
  
  // Calculate positions
  const angleStep = (Math.PI * 2) / axes.length
  const points = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2
    const x = center + Math.cos(angle) * radius * axis.value
    const y = center + Math.sin(angle) * radius * axis.value
    const labelX = center + Math.cos(angle) * (radius + 30)
    const labelY = center + Math.sin(angle) * (radius + 30)
    return { ...axis, x, y, labelX, labelY, angle }
  })
  
  // Create path for polygon
  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  
  // Get danger color
  const getDangerColor = () => {
    switch (profile.dangerLevel) {
      case 'CRITICAL': return '#ef4444'
      case 'HIGH': return '#f97316'
      case 'MEDIUM': return '#eab308'
      case 'LOW': return '#22c55e'
      default: return '#6b7280'
    }
  }
  
  return (
    <div className="relative bg-gray-900 rounded-lg p-6">
      <svg width={chartSize} height={chartSize} className="mx-auto">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
            strokeDasharray={i === 4 ? "0" : "2 4"}
            opacity={0.5}
          />
        ))}
        
        {/* Axes lines */}
        {points.map((point, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(point.angle) * radius}
            y2={center + Math.sin(point.angle) * radius}
            stroke="#374151"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}
        
        {/* Data polygon */}
        <path
          d={polygonPath}
          fill={getDangerColor()}
          fillOpacity={0.2}
          stroke={getDangerColor()}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={point.color}
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}
        
        {/* Labels */}
        {points.map((point, i) => (
          <g key={i}>
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-300 text-xs font-medium"
            >
              {point.label}
            </text>
            <text
              x={point.labelX}
              y={point.labelY + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-xs"
            >
              {(point.value * 10).toFixed(1)}
            </text>
          </g>
        ))}
        
        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#6b7280"
        />
      </svg>
      
      {/* Profile info */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">{profile.profileType}</h3>
        <div className="flex justify-center gap-6 text-sm">
          <div>
            <span className="text-gray-400">Danger:</span>
            <span className={`ml-2 font-bold`} style={{ color: getDangerColor() }}>
              {profile.dangerLevel}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Safety:</span>
            <span className="ml-2 font-bold text-green-400">
              {profile.safetyIndex > 0 ? '+' : ''}{profile.safetyIndex.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {profile.recommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Recommendations:</h4>
          <ul className="space-y-2">
            {profile.recommendations.slice(0, 3).map((rec, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start">
                <span className="text-yellow-400 mr-2 mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Profile2DRadar