import type { BreakdownRow } from '@/types/fiscal.types'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatColones, formatDollars } from '@/utils/formatters'
import styles from './BreakdownTable.module.css'

interface BreakdownTableProps {
  rows: BreakdownRow[]
  onOpenIsrModal: () => void
}

/**
 * Detailed annual breakdown table showing all income, deductions, taxes, and net.
 * Displays CRC above USD in the same column for each value.
 * Includes button to view ISR brackets in detail.
 */
export function BreakdownTable({ rows, onOpenIsrModal }: BreakdownTableProps) {
  return (
    <div>
      <div className={styles.scrollWrapper}>
        <table className={styles.breakdownTable}>
          <tbody>
            {rows.map((row, index) => {
              // Section header rows span full width with specific colors
              if (row.type === 'section') {
                // Determine section color class based on label
                let sectionClass = styles.sectionHeader;
                if (row.label === 'INGRESOS') {
                  sectionClass = `${styles.sectionHeader} ${styles.sectionHeaderIngresos}`;
                } else if (row.label === 'DEDUCCIONES PARA ISR') {
                  sectionClass = `${styles.sectionHeader} ${styles.sectionHeaderDeducciones}`;
                } else if (row.label === 'IMPUESTOS Y PAGOS') {
                  sectionClass = `${styles.sectionHeader} ${styles.sectionHeaderImpuestos}`;
                }
                
                return (
                  <tr key={index} className={sectionClass}>
                    <td colSpan={2}>{row.label}</td>
                  </tr>
                )
              }

              // Determine row styling based on type and icon
              let rowClass = styles.breakdownRow;
              
              if (row.type === 'subtotal') {
                // Special styling for specific subtotals
                if (row.icon === '📊') {
                  // Renta neta imponible - cobalt background (like DEDUCCIONES)
                  rowClass = styles.subtotalRowCobalt;
                } else if (row.icon === '💰') {
                  // ISR a pagar - white background (normal row)
                  rowClass = styles.subtotalRowWhite;
                } else {
                  // Default subtotal
                  rowClass = styles.subtotalRow;
                }
              } else if (row.type === 'total') {
                // Ingreso Neto Anual - emerald gradient
                rowClass = styles.totalRow;
              }

              return (
                <tr key={index} className={rowClass}>
                  <td className={styles.labelCell}>
                    {row.icon && <span className={styles.icon}>{row.icon}</span>}
                    <span className={styles.labelText}>{row.label}</span>
                    {row.tooltip && <Tooltip content={row.tooltip} />}
                  </td>
                  <td className={`${styles.valueCell} ${row.colorClass ? styles[`color${row.colorClass.charAt(0).toUpperCase()}${row.colorClass.slice(1)}`] : ''}`}>
                    <div className={styles.amountCRC}>{formatColones(row.valueCRC)}</div>
                    <div className={styles.amountUSD}>{formatDollars(row.valueUSD)}</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ISR info button */}
      <div className={styles.infoButtonRow}>
        <button className={styles.infoButton} onClick={onOpenIsrModal} type="button">
          <span className={styles.infoDot}></span> Ver tramos ISR 2026 en detalle
        </button>
      </div>
    </div>
  )
}
