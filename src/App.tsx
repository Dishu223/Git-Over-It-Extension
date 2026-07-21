import { useState, useEffect } from 'react'
import SetupWizard from './components/SetupWizard'
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect runs once when the component first loads!
  useEffect(() => {
    // Check if we already have a token saved in Chrome storage
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['github_pat'], (result) => {
        if (result.github_pat) {
          setToken(result.github_pat);
        }
        setIsLoading(false);
      });
    } else {
      // Fallback for local testing outside of extension
      setIsLoading(false);
    }
  }, []);

  const handleSetupComplete = (newToken: string) => {
    // Save it securely in Chrome extension storage
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ github_pat: newToken }, () => {
        setToken(newToken);
      });
    } else {
      setToken(newToken);
    }
  };

  if (isLoading) {
    return <div className="app-container">Loading...</div>;
  }

  // Conditional Rendering: If no token, show Wizard. If token, show Dashboard!
  if (!token) {
    return (
      <div className="app-container">
        <header className="app-header glass-panel">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h1>Git Over It</h1>
          </div>
        </header>
        <SetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h1>Git Over It</h1>
        </div>
        <p className="subtitle">LeetCode to GitHub Sync</p>
      </header>

      <main className="app-main">
        <div className="status-card glass-panel">
          <h2>Ready to Sync</h2>
          <p>Solve a problem on LeetCode and we'll automatically push it to your repository.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-box glass-panel">
            <span className="stat-label">Streak</span>
            <span className="stat-value">🔥 0</span>
          </div>
          <div className="stat-box glass-panel">
            <span className="stat-label">Pushed</span>
            <span className="stat-value">🚀 0</span>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Waiting for LeetCode submissions...</p>
      </footer>
    </div>
  )
}

export default App
