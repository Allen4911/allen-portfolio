/**
 * Tag / Badge component
 * variant: 'default' | 'primary' | 'dark' | 'outline'
 */
export default function Tag({ children, variant = 'default', className = '' }) {
  const variantClasses = {
    default: 'bg-[#f5f5f7] text-[#7a7a7a]',
    primary: 'bg-[#0066cc] text-white',
    dark: 'bg-[#272729] text-[#cccccc]',
    outline: 'border border-[#e0e0e0] text-[#7a7a7a] bg-transparent',
    'outline-dark': 'border border-[#3a3a3c] text-[#cccccc] bg-transparent',
  }

  return (
    <span
      className={`
        inline-flex items-center
        text-[12px] font-[400] leading-[1.0] tracking-[-0.12px]
        px-[10px] py-[4px] rounded-full
        ${variantClasses[variant] || variantClasses.default}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
