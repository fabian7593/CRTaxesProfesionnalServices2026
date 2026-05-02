import clsx from 'clsx'
import styles from './Chip.module.css'

interface ChipProps {
  label: string
  active: boolean
  variant: 'green' | 'amber'
  onClick: () => void
}

/**
 * Chip component used for toggle options (like currency selector, client type, etc).
 * Acts as a radio button with visual feedback for the active state.
 */
export function Chip({ label, active, variant, onClick }: ChipProps) {
  return (
    <button
      className={clsx(
        styles.chip,
        active && (variant === 'green' ? styles.onGreen : styles.onAmber)
      )}
      onClick={onClick}
      role="radio"
      aria-checked={active}
      type="button"
    >
      {label}
    </button>
  )
}
