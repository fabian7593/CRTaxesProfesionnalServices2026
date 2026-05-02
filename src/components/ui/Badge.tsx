import clsx from 'clsx'
import styles from './Badge.module.css'

interface BadgeProps {
  label: string
  variant?: 'default' | 'green' | 'amber'
}

/**
 * Badge component used in the Hero section to highlight features.
 * Supports different color variants for visual emphasis.
 */
export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={clsx(
        styles.badge,
        variant === 'green' && styles.badgeGreen,
        variant === 'amber' && styles.badgeAmber
      )}
    >
      {label}
    </span>
  )
}
