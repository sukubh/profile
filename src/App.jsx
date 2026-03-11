import { useEffect, useState } from 'react'
import MarriageProfile from './components/MarriageProfile'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import { trackVisitor } from './services/visitorTracker'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Track visitor when the app loads (only for home page)
  useEffect(() => {
    // Check hash for routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (hash === 'analytics') {
        setCurrentPage('analytics')
      } else {
        setCurrentPage('home')
      }
    }

    // Initial check
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    // Track visitor only on home page (not on analytics)
    if (window.location.hash !== '#analytics') {
      trackVisitor()
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Render based on current page
  if (currentPage === 'analytics') {
    return <AnalyticsDashboard />
  }

  return (
    <div className="app">
      <MarriageProfile />
    </div>
  )
}

export default App
