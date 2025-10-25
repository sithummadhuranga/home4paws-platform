interface StatusBadgeProps {
  status: 'lost' | 'found'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const baseStyles = 'px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm border-2 font-inter'
  const statusStyles = status === 'lost'
    ? 'bg-red-500/90 border-red-400/50 shadow-lg shadow-red-500/20'
    : 'bg-green-500/90 border-green-400/50 shadow-lg shadow-green-500/20'
  
  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}