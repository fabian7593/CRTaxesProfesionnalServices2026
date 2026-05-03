import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  content: string | ReactNode
}

/**
 * Tooltip component that displays a help icon (?) with a bubble on hover.
 * Used in slider labels to provide additional context about the field.
 * On mobile, tooltips are right-aligned to prevent overflow.
 */
export function Tooltip({ content }: TooltipProps) {
  return (
    <span className={styles.tooltipWrapper}>
      <span className={styles.tooltipIcon}>?</span>
      <div className={styles.tooltipBubble}>{content}</div>
    </span>
  )
}

