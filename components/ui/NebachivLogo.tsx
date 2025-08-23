/**
 * NebachivLogo Component
 * Official Buddha in motorcycle helmet logo
 * Concept: "Усвідомлений мотоцикліст"
 */

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
interface NebachivLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'alternative'
  className?: string
  showText?: boolean
  href?: string
}

const sizes = {
  sm: { width: 32, height: 32, textSize: 'text-sm' },
  md: { width: 40, height: 40, textSize: 'text-base' },
  lg: { width: 48, height: 48, textSize: 'text-lg' },
  xl: { width: 64, height: 64, textSize: 'text-xl' }
}

export function NebachivLogo({ 
  size = 'md', 
  variant = 'primary',
  className,
  showText = true,
  href = '/'
}: NebachivLogoProps) {
  const { width, height, textSize } = sizes[size]
  
  // Logo paths
  const logoSrc = variant === 'primary' 
    ? '/marketing_data/logos/palcemvglaz_dark_ninja_buddha_wearing_ICON_motorcycle_helmet_si_bf7c9345-ed92-4730-b9aa-d957aeee424e.png'
    : '/marketing_data/logos/palcemvglaz_httpss.mj.png'
  
  const logoAlt = variant === 'primary'
    ? 'Nebachiv - Buddha в мотошоломі ICON'
    : 'Nebachiv - Медитуючий райдер'

  const LogoContent = () => (
    <>
      <div className={cn(
        'relative overflow-hidden rounded-lg',
        className
      )}>
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={width}
          height={height}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <span className={cn(
          'ml-3 font-bold text-white',
          textSize
        )}>
          Nebachiv
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link 
        href={href}
        className="flex items-center hover:opacity-90 transition-opacity"
      >
        <LogoContent />
      </Link>
    )
  }

  return (
    <div className="flex items-center">
      <LogoContent />
    </div>
  )
}

// Convenience exports
export const PrimaryLogo = (props: Omit<NebachivLogoProps, 'variant'>) => (
  <NebachivLogo variant="primary" {...props} />
)

export const AlternativeLogo = (props: Omit<NebachivLogoProps, 'variant'>) => (
  <NebachivLogo variant="alternative" {...props} />
)