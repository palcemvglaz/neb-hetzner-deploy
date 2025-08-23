/**
 * BrandedButton Component
 * Nebachiv Brand Guide Implementation
 * Concept: "Усвідомлений мотоцикліст"
 */

import { cn } from '@/lib/utils'
import React from 'react'
export interface BrandedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export function BrandedButton({ 
  variant = 'primary', 
  size = 'md', 
  children,
  className,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props 
}: BrandedButtonProps) {
  const isDisabled = disabled || loading

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-nebachiv-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    primary: 'bg-nebachiv-blue hover:bg-nebachiv-blue-dark text-white focus:ring-nebachiv-blue hover-glow-blue',
    secondary: 'bg-transparent border-2 border-nebachiv-blue text-nebachiv-blue hover:bg-nebachiv-blue hover:text-white focus:ring-nebachiv-blue',
    gradient: 'bg-gradient-nebachiv-hero text-white hover:shadow-lg hover-scale focus:ring-nebachiv-orange',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-gray-500',
    danger: 'bg-nebachiv-error hover:bg-nebachiv-orange/80 text-white focus:ring-nebachiv-orange'
  }
  
  const sizes = {
    sm: 'py-2 px-4 text-sm gap-1.5',
    md: 'py-3 px-6 text-base gap-2',
    lg: 'py-4 px-8 text-lg gap-2.5'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  )
}

// Convenience exports for common button types
export const PrimaryButton = (props: Omit<BrandedButtonProps, 'variant'>) => (
  <BrandedButton variant="primary" {...props} />
)

export const SecondaryButton = (props: Omit<BrandedButtonProps, 'variant'>) => (
  <BrandedButton variant="secondary" {...props} />
)

export const GradientButton = (props: Omit<BrandedButtonProps, 'variant'>) => (
  <BrandedButton variant="gradient" {...props} />
)

export const GhostButton = (props: Omit<BrandedButtonProps, 'variant'>) => (
  <BrandedButton variant="ghost" {...props} />
)

export const DangerButton = (props: Omit<BrandedButtonProps, 'variant'>) => (
  <BrandedButton variant="danger" {...props} />
)