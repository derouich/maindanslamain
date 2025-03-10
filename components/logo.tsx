import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  white?: boolean
}

export default function Logo({ size = 'md', className = '', white = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  }
  
  return (
    <img 
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unity-H2KANN3831cvbYXchn6pad8ZFt0bbi.png"
      alt="MainDansLaMain - Deux mains formant un coeur" 
      className={`${sizeClasses[size]} ${white ? 'filter brightness-0 invert' : ''} ${className}`}
      style={{
        filter: white ? 'brightness(0) invert(1)' : 'none'
      }}
    />
  )
}

