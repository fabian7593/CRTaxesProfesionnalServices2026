import { ReactNode } from 'react'
import { Tooltip } from './Tooltip'
import styles from './SliderField.module.css'

interface SliderFieldProps {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  valueDisplay: string
  onChange: (newValue: number) => void
  hints: [string, string]
  tooltip?: string | ReactNode
}

/**
 * Custom slider field with visual track fill and formatted value display.
 * The actual range input is positioned over the custom track with opacity 0.
 */
export function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  valueDisplay,
  onChange,
  hints,
  tooltip,
}: SliderFieldProps) {
  // Calculate how far the slider fill bar should extend (0% to 100%)
  const fillPercentage = ((value - min) / (max - min)) * 100

  return (
    <div className={styles.sliderRow}>
      {/* Label + current value display */}
      <div className={styles.sliderTop}>
        <label className={styles.sliderLabel} htmlFor={id}>
          {label}
          {tooltip && <Tooltip content={tooltip} />}
        </label>
        <span className={styles.sliderValue}>{valueDisplay}</span>
      </div>

      {/* Custom track with fill bar underneath the real input */}
      <div className={styles.sliderTrack}>
        <div className={styles.sliderFill} style={{ width: `${fillPercentage}%` }} />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
        />
      </div>

      {/* Min / Max hints */}
      <div className={styles.sliderHints}>
        <span>{hints[0]}</span>
        <span>{hints[1]}</span>
      </div>
    </div>
  )
}
