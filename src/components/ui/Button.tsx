'use client'

import Link from 'next/link'

/**
 * Button component
 * variant: 'primary' | 'secondary' | 'secondary-dark' | 'dark-utility'
 * href: renders as <Link> if provided, otherwise <button>
 */
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'secondary-dark' | 'dark-utility'
  href?: string
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  external?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  [key: string]: unknown
}

import React from 'react'

export default function Button({
  variant = 'primary',
  href,
  children,
  onClick,
  className = '',
  external = false,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClass = (() => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'btn-secondary'
      case 'secondary-dark':
        return 'btn-secondary-dark'
      case 'dark-utility':
        return 'btn-dark-utility'
      default:
        return 'btn-primary'
    }
  })()

  const classes = `${baseClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`.trim()

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}
