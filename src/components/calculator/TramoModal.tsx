import type { ISRResult, CalculatorRegimeType } from '@/types/fiscal.types'
import { Modal } from '@/components/ui/Modal'
import { formatColones as fC } from '@/utils/formatters'
import styles from './TramoModal.module.css'

interface TramoModalProps {
  isOpen: boolean
  onClose: () => void
  isrResult: ISRResult
  regime: CalculatorRegimeType
}

/**
 * ISR Brackets Modal - displays the progressive tax calculation breakdown.
 * 
 * Shows all 5 ISR brackets with:
 * - Tax rate percentage
 * - Visual bar showing proportion of income in each bracket
 * - Income range for the bracket
 * - Tax amount calculated for that bracket
 * 
 * Active brackets (where base > 0) are highlighted.
 * The total ISR amount is shown at the bottom.
 * 
 * For mixed regime (salary + independent income), shows an explanation
 * about why there is no exempt bracket for independent income.
 */
export function TramoModal({ isOpen, onClose, isrResult, regime }: TramoModalProps) {
  const { total, detalles } = isrResult

  // Find the maximum base amount to scale the bars proportionally
  const maxBase = Math.max(...detalles.map((d) => d.base), 1)

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Tramos ISR 2026" 
      subtitle="Decreto Ejecutivo 45333-H · Ley del Impuesto sobre la Renta (arts. 15, 23, 28 y 33)"
      maxWidth="680px"
    >
      <div className={styles.modalIsrAlert}>
        <strong>ℹ️ Impuesto escalonado:</strong> El ISR en Costa Rica es progresivo. Cada tramo
        tributa solo sobre el monto que cae dentro de ese rango, no sobre el total.
      </div>

      {/* Mixed regime explanation - only show for mixto regime */}
      {regime === 'mixto' && (
        <div className={styles.modalIsrMixedExplanation}>
          <strong>⚠️ Régimen mixto (asalariado + independiente):</strong>
          <p>
            Según el artículo 15 inciso c) de la Ley del ISR, una persona solo puede tener un 
            mínimo exento. Si recibís salario y además ingresos como independiente, el tramo 
            exento ya fue consumido por el salario en el impuesto al salario que te retiene 
            tu patrono.
          </p>
          <p>
            Por lo tanto, cuando declarás el D-101 como persona física con actividad lucrativa, 
            los ingresos de servicios profesionales se suman al salario para ubicarte en el 
            tramo correcto, pero el exento ya fue aprovechado. Los honorarios tributan en el 
            tramo que corresponda según la suma total de ambos ingresos (salario + servicios).
          </p>
        </div>
      )}

      {/* Column headers */}
      <div className={styles.modalIsrHeader}>
        <div className={styles.modalIsrColTasa}>Tasa</div>
        <div className={styles.modalIsrColProp}>Proporción</div>
        <div className={styles.modalIsrColMonto}>Monto en tramo</div>
        <div className={styles.modalIsrColIsr}>ISR</div>
      </div>

      {/* Bracket rows */}
      {detalles.map((detalle, index) => {
        const isActive = detalle.base > 0
        const fillPercentage = maxBase > 0 ? (detalle.base / maxBase) * 100 : 0
        const rangeLabel = getBracketRangeLabel(detalle.tramo.desde, detalle.tramo.hasta)

        return (
          <div
            key={index}
            className={`${styles.tramoItem} ${isActive ? styles.tramoItemAct : ''}`}
          >
            {/* Tax rate */}
            <div className={styles.tPct}>{detalle.tramo.label}</div>

            {/* Visual bar */}
            <div className={styles.tBar}>
              <div className={styles.tFill} style={{ width: `${fillPercentage}%` }} />
            </div>

            {/* Income range */}
            <div className={styles.tRange}>{rangeLabel}</div>

            {/* Tax amount */}
            <div className={styles.tImp}>{isActive ? fC(detalle.impuesto) : '—'}</div>
          </div>
        )
      })}

      {/* Total ISR */}
      <div className={styles.modalIsrFooter}>
        <span className={styles.modalIsrFooterLabel}>Total ISR bruto:</span>
        <span className={styles.modalIsrFooterValue}>{fC(total)}</span>
      </div>

      <div className={styles.modalIsrNote}>
        <p>
          <strong>Nota:</strong> Este es el ISR bruto antes de aplicar créditos fiscales (hijos,
          cónyuge). El ISR final puede ser menor después de aplicar estos créditos.
        </p>
      </div>
    </Modal>
  )
}

/**
 * Gets the display label for an ISR bracket's income range.
 * 
 * @param desde - Starting amount for the bracket
 * @param hasta - Ending amount (null = no limit)
 * @returns Formatted range label
 */
function getBracketRangeLabel(desde: number, hasta: number | null): string {
  if (desde === 0 && hasta !== null) {
    return `hasta ${fC(hasta)}`
  }

  if (hasta === null) {
    return `más de ${fC(desde)}`
  }

  return `${fC(desde)} – ${fC(hasta)}`
}
