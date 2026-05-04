import { useRef, type ReactNode } from 'react'
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
 * 
 * Mobile optimization: Uses touch event detection to distinguish between
 * vertical scroll and horizontal slider interaction.
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

  // Touch tracking for mobile scroll vs slider detection
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const isSliderActiveRef = useRef(false)

  /**
   * Handle touch start - record initial position
   */
  const handleTouchStart = (event: React.TouchEvent<HTMLInputElement>) => {
    const touch = event.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
    isSliderActiveRef.current = false
  }

  /**
   * Handle touch move - determine if this is a scroll or slider interaction
   * Only activate slider if movement is predominantly horizontal
   */
  const handleTouchMove = (event: React.TouchEvent<HTMLInputElement>) => {
    if (!touchStartRef.current) return

    const touch = event.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
    const totalMovement = deltaX + deltaY

    // Require minimum movement to avoid accidental activation
    if (totalMovement < 5) return

    // Calculate direction: if >60% horizontal, it's a slider interaction
    const horizontalRatio = deltaX / totalMovement

    if (horizontalRatio > 0.6) {
      // This is a horizontal gesture - activate slider
      isSliderActiveRef.current = true
    } else {
      // This is a vertical gesture - allow scroll, prevent slider
      if (!isSliderActiveRef.current) {
        event.preventDefault()
      }
    }
  }

  /**
   * Handle touch end - reset tracking
   */
  const handleTouchEnd = () => {
    touchStartRef.current = null
    isSliderActiveRef.current = false
  }

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
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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

