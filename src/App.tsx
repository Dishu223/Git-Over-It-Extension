import { useState, useEffect } from 'react'
import SetupWizard from './components/SetupWizard'
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pushedCount, setPushedCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  
  // Settings state
  const [showPopup, setShowPopup] = useState(true);
  const [folderStructure, setFolderStructure] = useState('flat');

  // useEffect runs once when the component first loads!
  useEffect(() => {
    // Check if we already have a token saved in Chrome storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['github_pat', 'pushedCount', 'showPopup', 'folderStructure'], (result: { [key: string]: any }) => {
        if (result.github_pat) {
          setToken(result.github_pat);
        }
        if (result.pushedCount) {
          setPushedCount(result.pushedCount);
        }
        if (result.showPopup !== undefined) {
          setShowPopup(result.showPopup);
        }
        if (result.folderStructure) {
          setFolderStructure(result.folderStructure);
        }
        setIsLoading(false);
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.pushedCount) {
          setPushedCount(changes.pushedCount.newValue as number);
        }
      });
    } else {
      // Fallback for local testing outside of extension
      setIsLoading(false);
    }
  }, []);

  const handleSetupComplete = (newToken: string) => {
    // Save it securely in Chrome extension storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ github_pat: newToken }, () => {
        setToken(newToken);
      });
    } else {
      setToken(newToken);
    }
  };

  const saveSetting = (key: string, value: any) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [key]: value });
    }
  };

  const togglePopup = () => {
    const newValue = !showPopup;
    setShowPopup(newValue);
    saveSetting('showPopup', newValue);
  };

  const changeFolderStructure = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setFolderStructure(newValue);
    saveSetting('folderStructure', newValue);
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

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings ⚙️
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'dashboard' ? (
          <>
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
                <span className="stat-value">🚀 {pushedCount}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="settings-panel glass-panel">
            <h2>Preferences</h2>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>Success Popup</label>
                <p>Show a notification on LeetCode when push succeeds.</p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={showPopup} onChange={togglePopup} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Folder Organization</label>
                <p>How your GitHub repository should be structured.</p>
              </div>
              <select className="setting-select" value={folderStructure} onChange={changeFolderStructure}>
                <option value="flat">Flat (solutions/)</option>
                <option value="difficulty">By Difficulty (Medium/..)</option>
                <option value="language">By Language (cpp/..)</option>
                <option value="datastructure">By Topic (Arrays/..)</option>
              </select>
            </div>
            {folderStructure !== 'flat' && (
              <p style={{ fontSize: '11px', color: '#ff9800', marginTop: '-8px', marginBottom: '16px', lineHeight: '1.4' }}>
                ⚠️ <strong>Note:</strong> Changing this will only affect <em>future</em> pushes. Existing folders on GitHub won't be moved automatically! We recommend picking one style and sticking to it.
              </p>
            )}

            <div className="setting-instructions">
              <h3>How it works</h3>
              <p>1. Solve any problem on LeetCode.</p>
              <p>2. Get an "Accepted" verdict.</p>
              <p>3. Git Over It automatically pushes the code!</p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>{activeTab === 'dashboard' ? 'Waiting for LeetCode submissions...' : 'Git Over It v1.0.0'}</p>
      </footer>
    </div>
  )
}

export default App
