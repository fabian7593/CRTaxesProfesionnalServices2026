import { useState, useEffect } from 'react'
import styles from './DocsPage.module.css'

interface DocsPageProps {
  onBackToCalculator: () => void
}

/**
 * Documentation page component that fetches and displays the README from GitHub.
 * 
 * Features:
 * - Fetches README content from GitHub API as HTML
 * - Shows loading spinner while fetching
 * - Displays error state with fallback link to GitHub
 * - Renders markdown-styled HTML content
 * - Opens external links in new tabs
 */
export function DocsPage({ onBackToCalculator }: DocsPageProps) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [htmlContent, setHtmlContent] = useState<string>('')

  useEffect(() => {
    // Fetch README from GitHub API
    async function fetchReadme() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/fabian7593/CRTaxes2026/readme',
          {
            headers: {
              Accept: 'application/vnd.github.v3.html',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const html = await response.text()
        setHtmlContent(html)
        setLoadingState('loaded')

        // After content is loaded, make external links open in new tabs
        setTimeout(() => {
          const links = document.querySelectorAll('#readme-content a')
          links.forEach((link) => {
            const anchor = link as HTMLAnchorElement
            if (anchor.hostname !== window.location.hostname) {
              anchor.setAttribute('target', '_blank')
              anchor.setAttribute('rel', 'noopener noreferrer')
            }
          })
        }, 100)

        console.log('✓ README loaded successfully from GitHub')
      } catch (error) {
        console.error('Error loading README:', error)
        setLoadingState('error')
      }
    }

    fetchReadme()
  }, [])

  return (
    <div className={styles.docsPage}>
      {/* Header */}
      <div className={styles.docsHeader}>
        <div className={styles.docsHeaderInner}>
          <div className={styles.docsTitle}>
            <span>📚</span>
            Documentación Completa
          </div>
          <button
            type="button"
            className={styles.docsBack}
            onClick={onBackToCalculator}
          >
            <span>←</span>
            Volver a la calculadora
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loadingState === 'loading' && (
        <div className={styles.docsLoading}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>Cargando documentación desde GitHub...</div>
        </div>
      )}

      {/* Loaded state */}
      {loadingState === 'loaded' && (
        <div className={styles.docsContent}>
          <div
            id="readme-content"
            className={styles.readmeWrapper}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}

      {/* Error state */}
      {loadingState === 'error' && (
        <div className={styles.docsError}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorTitle}>No se pudo cargar la documentación</div>
          <div className={styles.errorMessage}>
            Hubo un problema al conectar con GitHub. Por favor, intenta de nuevo más tarde.
          </div>
          <a
            href="https://github.com/fabian7593/CRTaxes2026/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.errorLink}
          >
            Ver en GitHub
            <span>↗</span>
          </a>
        </div>
      )}
    </div>
  )
}
