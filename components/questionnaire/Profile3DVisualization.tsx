'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Profile3D } from '@/lib/questionnaire/profile-calculator-3d-simple'

interface Profile3DVisualizationProps {
  profile: Profile3D
  showLabels?: boolean
  interactive?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function Profile3DVisualization({ 
  profile, 
  showLabels = true,
  interactive = true,
  size = 'medium' 
}: Profile3DVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: -30, y: 45 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  // Size configurations
  const sizes = {
    small: { width: 300, height: 300, padding: 40 },
    medium: { width: 500, height: 500, padding: 60 },
    large: { width: 700, height: 700, padding: 80 }
  }
  
  const config = sizes[size]
  
  // Convert 3D coordinates to 2D projection
  const project3D = (x: number, y: number, z: number) => {
    const radX = (rotation.x * Math.PI) / 180
    const radY = (rotation.y * Math.PI) / 180
    
    // Apply rotation
    const x1 = x * Math.cos(radY) - z * Math.sin(radY)
    const z1 = x * Math.sin(radY) + z * Math.cos(radY)
    const y1 = y * Math.cos(radX) - z1 * Math.sin(radX)
    const z2 = y * Math.sin(radX) + z1 * Math.cos(radX)
    
    // Scale and center
    const scale = (config.width - config.padding * 2) / 20
    const centerX = config.width / 2
    const centerY = config.height / 2
    
    return {
      x: centerX + x1 * scale,
      y: centerY - y1 * scale,
      z: z2
    }
  }
  
  // Mouse event handlers for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5
    })
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  // Get color based on danger level
  const getDangerColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444'
      case 'HIGH': return '#f97316'
      case 'MEDIUM': return '#eab308'
      case 'LOW': return '#22c55e'
      default: return '#6b7280'
    }
  }
  
  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, config.width, config.height)
    
    // Set up styles
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    ctx.font = '12px Inter, system-ui, sans-serif'
    
    // Draw axes
    const axes = [
      { start: [0, 0, 0], end: [10, 0, 0], label: 'Risk →', color: '#ef4444' },
      { start: [0, 0, 0], end: [0, 10, 0], label: 'Skills ↑', color: '#22c55e' },
      { start: [0, 0, 0], end: [0, 0, 10], label: 'Adequacy', color: '#3b82f6' }
    ]
    
    axes.forEach(axis => {
      const start = project3D(axis.start[0], axis.start[1], axis.start[2])
      const end = project3D(axis.end[0], axis.end[1], axis.end[2])
      
      // Draw axis line
      ctx.strokeStyle = axis.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
      
      // Draw axis label
      if (showLabels) {
        ctx.fillStyle = axis.color
        ctx.font = 'bold 14px Inter, system-ui, sans-serif'
        ctx.fillText(axis.label, end.x + 5, end.y)
      }
    })
    
    // Draw grid lines
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 4])
    
    // XY plane grid
    for (let i = 0; i <= 10; i += 2) {
      // Lines parallel to X axis
      const startX = project3D(0, i, 0)
      const endX = project3D(10, i, 0)
      ctx.beginPath()
      ctx.moveTo(startX.x, startX.y)
      ctx.lineTo(endX.x, endX.y)
      ctx.stroke()
      
      // Lines parallel to Y axis
      const startY = project3D(i, 0, 0)
      const endY = project3D(i, 10, 0)
      ctx.beginPath()
      ctx.moveTo(startY.x, startY.y)
      ctx.lineTo(endY.x, endY.y)
      ctx.stroke()
    }
    
    ctx.setLineDash([])
    
    // Draw reference zones
    const zones = [
      { x: [0, 4], y: [0, 4], z: [2.5, 7.5], color: 'rgba(239, 68, 68, 0.1)', label: 'Danger Zone' },
      { x: [6, 10], y: [6, 10], z: [4, 6], color: 'rgba(34, 197, 94, 0.1)', label: 'Safe Zone' }
    ]
    
    zones.forEach(zone => {
      const corners = [
        project3D(zone.x[0], zone.y[0], zone.z[0]),
        project3D(zone.x[1], zone.y[0], zone.z[0]),
        project3D(zone.x[1], zone.y[1], zone.z[0]),
        project3D(zone.x[0], zone.y[1], zone.z[0])
      ]
      
      ctx.fillStyle = zone.color
      ctx.beginPath()
      ctx.moveTo(corners[0].x, corners[0].y)
      corners.forEach(corner => ctx.lineTo(corner.x, corner.y))
      ctx.closePath()
      ctx.fill()
    })
    
    // Draw rider position
    const riderPos = project3D(
      profile.riskTaking,
      profile.technicalSkills,
      profile.adequacy + 5 // Shift from -5..+5 to 0..10 for visualization
    )
    
    // Draw shadow on XY plane
    const shadowPos = project3D(profile.riskTaking, profile.technicalSkills, 0)
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(shadowPos.x, shadowPos.y)
    ctx.lineTo(riderPos.x, riderPos.y)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw point shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.arc(shadowPos.x, shadowPos.y, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw rider point
    const color = getDangerColor(profile.dangerLevel)
    const pulseSize = 15 + Math.sin(Date.now() * 0.003) * 3
    
    // Outer glow
    const gradient = ctx.createRadialGradient(
      riderPos.x, riderPos.y, 0,
      riderPos.x, riderPos.y, pulseSize
    )
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(riderPos.x, riderPos.y, pulseSize, 0, Math.PI * 2)
    ctx.fill()
    
    // Main point
    ctx.fillStyle = color
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(riderPos.x, riderPos.y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    // Draw coordinate values
    if (showLabels) {
      ctx.fillStyle = '#e5e7eb'
      ctx.font = 'bold 12px Inter, system-ui, sans-serif'
      ctx.fillText(
        `(${profile.riskTaking.toFixed(1)}, ${profile.technicalSkills.toFixed(1)}, ${profile.adequacy.toFixed(1)})`,
        riderPos.x + 15,
        riderPos.y - 15
      )
    }
    
    // Draw profile type label
    ctx.fillStyle = color
    ctx.font = 'bold 16px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(profile.profileType, config.width / 2, 30)
    
    // Draw metrics
    const metrics = [
      { label: 'Safety Index', value: profile.safetyIndex.toFixed(1), color: '#22c55e' },
      { label: 'Growth Potential', value: profile.growthPotential.toFixed(1), color: '#3b82f6' },
      { label: 'Danger Level', value: profile.dangerLevel, color: getDangerColor(profile.dangerLevel) }
    ]
    
    ctx.textAlign = 'left'
    metrics.forEach((metric, i) => {
      const y = config.height - 70 + i * 20
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px Inter, system-ui, sans-serif'
      ctx.fillText(metric.label + ':', 10, y)
      ctx.fillStyle = metric.color
      ctx.font = 'bold 12px Inter, system-ui, sans-serif'
      ctx.fillText(metric.value, 100, y)
    })
    
    // Draw instructions if interactive
    if (interactive) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '11px Inter, system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('Drag to rotate', config.width - 10, config.height - 10)
    }
    
  }, [profile, rotation, config, showLabels, interactive])
  
  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={config.width}
        height={config.height}
        className={`bg-gray-900 rounded-lg shadow-2xl ${
          interactive ? 'cursor-move' : ''
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 p-3 rounded-lg text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-gray-300">Risk-Taking (X)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-300">Skills (Y)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-300">Adequacy (Z)</span>
          </div>
        </div>
      </div>
      
      {/* Characteristics */}
      {profile.characteristics.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Characteristics:</h4>
          <ul className="space-y-1">
            {profile.characteristics.map((char, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {char}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Red Flags */}
      {profile.redFlags.length > 0 && (
        <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg">
          <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ Red Flags:</h4>
          <ul className="space-y-1">
            {profile.redFlags.map((flag, i) => (
              <li key={i} className="text-xs text-red-300 flex items-start">
                <span className="text-red-500 mr-2">!</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Profile3DVisualization