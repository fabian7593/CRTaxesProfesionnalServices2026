import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './CardSection.module.css'

interface CardSectionProps {
  title: string
  icon?: string
  iconVariant?: 'g' | 'a' | 'b' | 'r'
  children: ReactNode
  id?: string
}

/**
 * Card section component with title, optional icon, and decorative line.
 * Used to group related inputs or information in the calculator.
 */
export function CardSection({ title, icon, iconVariant = 'g', children, id }: CardSectionProps) {
  return (
    <div className={styles.card} id={id}>
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
