import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './CardSection.module.css'

interface CardSectionProps {
  title: string
  icon?: string
  iconVariant?: 'g' | 'a' | 'b' | 'r'
  children: ReactNode
}

/**
 * Card section component with title, optional icon, and decorative line.
 * Used to group related inputs or information in the calculator.
 */
export function CardSection({ title, icon, iconVariant = 'g', children }: CardSectionProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        {icon && (
          <span className={clsx(styles.cardIcon, styles[`cardIcon${iconVariant.toUpperCase()}`])}>
            {icon}
          </span>
        )}
        {title}
      </div>
      {children}
    </div>
  )
}
