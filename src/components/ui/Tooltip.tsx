import { type ReactNode, useState, useRef, useEffect, useId } from 'react'
import styles from './Tooltip.module.css'

interface TooltipProps {
  content: string | ReactNode
}

// Global event for closing all tooltips
const CLOSE_ALL_TOOLTIPS_EVENT = 'closeAllTooltips'

/**
 * Tooltip component that displays a help icon (?) with a bubble on hover.
 * On mobile, uses JavaScript to calculate position and prevent clipping.
 * 
 * Global behavior:
 * - Only one tooltip can be open at a time
 * - Clicking outside or scrolling closes the open tooltip
 * - Opening a new tooltip closes any previously open tooltip
 */
export function Tooltip({ content }: TooltipProps) {
  const tooltipId = useId()
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({})

  // Calculate position when tooltip opens
  useEffect(() => {
    if (!isOpen || !wrapperRef.current || !bubbleRef.current) {
      setBubbleStyle({})
      return
    }

    // Only calculate position on mobile
    if (window.innerWidth > 840) {
      setBubbleStyle({})
      return
    }

    const updatePosition = () => {
      if (!wrapperRef.current || !bubbleRef.current) return

      const iconRect = wrapperRef.current.getBoundingClientRect()
      
      // Get bubble dimensions after it's rendered
      const bubbleHeight = bubbleRef.current.offsetHeight || 80
      
      // Position above the icon with some spacing
      const top = iconRect.top - bubbleHeight - 10

      // If tooltip would go above viewport, position it below instead
      const finalTop = top < 10 ? iconRect.bottom + 10 : top

      setBubbleStyle({
        top: `${finalTop}px`,
      })
    }

    // Update position after a small delay to ensure bubble is rendered
    const timer = setTimeout(updatePosition, 10)

    return () => clearTimeout(timer)
  }, [isOpen])

  // Listen for global close event
  useEffect(() => {
    const handleCloseAll = (e: Event) => {
      const customEvent = e as CustomEvent
      // Don't close if this is the tooltip that triggered the event
      if (customEvent.detail?.exceptId !== tooltipId) {
        setIsOpen(false)
      }
    }

    window.addEventListener(CLOSE_ALL_TOOLTIPS_EVENT, handleCloseAll)
    return () => window.removeEventListener(CLOSE_ALL_TOOLTIPS_EVENT, handleCloseAll)
  }, [tooltipId])

  // Clear bubble style when tooltip closes - IMMEDIATE
  useEffect(() => {
    if (!isOpen) {
      // Force immediate cleanup
      setBubbleStyle({})
      
      // Also force remove any inline styles from the bubble element
      if (bubbleRef.current) {
        bubbleRef.current.style.top = ''
      }
    }
  }, [isOpen])

  // Close on click/touch outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    // Add listeners with a small delay to avoid immediate closure
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Close on scroll (mobile)
  useEffect(() => {
    if (!isOpen || window.innerWidth > 840) return

    const handleScroll = () => {
      setIsOpen(false)
    }

    // Listen to scroll on window and all scrollable parents
    window.addEventListener('scroll', handleScroll, true)
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  const handleMouseEnter = () => {
    // Desktop: just open on hover
    if (window.innerWidth > 840) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    // Desktop: close on mouse leave
    if (window.innerWidth > 840) {
      setIsOpen(false)
    }
  }

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Mobile: toggle on touch
    if (window.innerWidth <= 840) {
      if (!isOpen) {
        // Close all other tooltips before opening this one
        window.dispatchEvent(new CustomEvent(CLOSE_ALL_TOOLTIPS_EVENT, {
          detail: { exceptId: tooltipId }
        }))
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
  }

  return (
    <span 
      ref={wrapperRef}
      className={styles.tooltipWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
      data-hovered={isOpen ? 'true' : 'false'}
    >
      <span className={styles.tooltipIcon}>?</span>
      <div 
        ref={bubbleRef}
        className={styles.tooltipBubble}
        style={isOpen && window.innerWidth <= 840 && bubbleStyle.top ? bubbleStyle : undefined}
      >
        {content}
      </div>
    </span>
  )
}

