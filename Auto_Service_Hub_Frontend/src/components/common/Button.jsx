import React from 'react'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#09090b] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.98]'

  const variantStyles = {
    primary: 'bg-[#d8ff3d] text-black hover:bg-[#c7f02e] focus:ring-[#d8ff3d] shadow-[0_0_20px_rgba(216,255,61,0.25)] font-semibold',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/80 focus:ring-zinc-500',
    outline: 'border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/60 focus:ring-zinc-500',
    danger: 'bg-red-600/90 text-white hover:bg-red-500 focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    success: 'bg-emerald-600/90 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    accent: 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50 focus:ring-zinc-600',
  }

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  )
}
