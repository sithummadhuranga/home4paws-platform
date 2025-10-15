interface StatusBadgeProps {
  status: 'lost' | 'found'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const baseStyles = 'px-2 py-1 rounded-full text-xs font-semibold text-white'
  const statusStyles = status === 'lost' 
    ? 'bg-red-500'
    : 'bg-green-500'

  return (
    <span className={`${baseStyles} ${statusStyles} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
