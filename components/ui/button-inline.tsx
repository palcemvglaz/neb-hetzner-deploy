import React from 'react'
import { Button, ButtonProps } from './button'
import { cn } from '@/lib/utils'

interface ButtonInlineProps extends ButtonProps {
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Button component that ensures content stays on a single line
 * Use this for navigation buttons with icons
 */
export const ButtonInline = React.forwardRef<HTMLButtonElement, ButtonInlineProps>(
  ({ children, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn('whitespace-nowrap', className)}
        {...props}
      >
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          {leftIcon && <span className="inline-block flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-block flex-shrink-0">{rightIcon}</span>}
        </span>
      </Button>
    )
  }
)

ButtonInline.displayName = 'ButtonInline'