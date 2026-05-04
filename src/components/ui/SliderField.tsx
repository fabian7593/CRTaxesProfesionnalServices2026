import { useState, useEffect, type ReactNode } from 'react'
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
 * On mobile (touch devices), clicking the slider opens a modal for precise numeric input.
 * On desktop, the slider works normally.
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

  // Detect if device has touch capability
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  useEffect(() => {
    // Check if device supports touch
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)
  }, [])

  // Update input value when slider value changes externally
  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  /**
   * Handle slider track click on touch devices - open modal
   */
  const handleTrackClick = () => {
    if (isTouchDevice) {
      setInputValue(value.toString())
      setIsModalOpen(true)
    }
  }

  /**
   * Handle modal confirm - validate and apply new value
   */
  const handleConfirm = () => {
    const numValue = Number(inputValue)
    
    // Validate input
    if (isNaN(numValue)) {
      setInputValue(value.toString())
      setIsModalOpen(false)
      return
    }

    // Clamp to min/max
    const clampedValue = Math.max(min, Math.min(max, numValue))
    
    // Round to nearest step
    const steppedValue = Math.round(clampedValue / step) * step
    
    onChange(steppedValue)
    setIsModalOpen(false)
  }

  /**
   * Handle modal cancel - reset and close
   */
  const handleCancel = () => {
    setInputValue(value.toString())
    setIsModalOpen(false)
  }

  /**
   * Handle input change - only allow numbers
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    // Allow empty string, numbers, and one decimal point
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue)
    }
  }

  /**
   * Handle Enter key in input
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <>
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
        <div 
          className={`${styles.sliderTrack} ${isTouchDevice ? styles.sliderTrackTouchable : ''}`}
          onClick={handleTrackClick}
        >
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
            className={isTouchDevice ? styles.sliderDisabled : ''}
            disabled={isTouchDevice}
            tabIndex={isTouchDevice ? -1 : 0}
          />
        </div>

        {/* Min / Max hints */}
        <div className={styles.sliderHints}>
          <span>{hints[0]}</span>
          <span>{hints[1]}</span>
        </div>
      </div>

      {/* Modal for touch devices */}
      {isTouchDevice && isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{label}</h3>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Ingresá el valor</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className={styles.numericInput}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  placeholder={`${min} - ${max}`}
                />
                <div className={styles.inputHint}>
                  Rango: {hints[0]} - {hints[1]}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                type="button"
                className={styles.btnCancel} 
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button 
                type="button"
                className={styles.btnConfirm} 
                onClick={handleConfirm}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}



