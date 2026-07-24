import { useState, useEffect } from 'react'
import SetupWizard from './components/SetupWizard'
import './App.css'

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="tooltip-container">
    <svg className="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <div className="tooltip-text">{text}</div>
  </div>
);

const Particles = () => (
  <div className="particles-container">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="particle" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${Math.random() * 4 + 2}px`,
        height: `${Math.random() * 4 + 2}px`,
        animationDelay: `${Math.random() * 15}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }}></div>
    ))}
  </div>
);

export const playPopSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
};

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pushedCount, setPushedCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Settings state
  const [showPopup, setShowPopup] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [folderStructure, setFolderStructure] = useState('flat');
  const [repoName, setRepoName] = useState('Git-Over-It');
  const [theme, setTheme] = useState('dark');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['github_pat', 'pushedCount', 'showPopup', 'folderStructure', 'github_repo', 'theme', 'userName', 'soundEnabled'], (result: { [key: string]: any }) => {
        if (result.github_pat) setToken(result.github_pat);
        if (result.pushedCount) setPushedCount(result.pushedCount);
        if (result.showPopup !== undefined) setShowPopup(result.showPopup);
        if (result.soundEnabled !== undefined) setSoundEnabled(result.soundEnabled);
        if (result.folderStructure) setFolderStructure(result.folderStructure);
        if (result.github_repo) setRepoName(result.github_repo);
        if (result.theme) setTheme(result.theme);
        if (result.userName) setUserName(result.userName);
        
        setIsLoading(false);
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.pushedCount) {
          setPushedCount(changes.pushedCount.newValue as number);
          // Trigger success pulse and sound when push completes!
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 1000);
          
          chrome.storage.local.get(['soundEnabled'], (res) => {
             if (res.soundEnabled !== false) playPopSound();
          });
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSetupComplete = (newToken: string) => {
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
    if (!soundEnabled) playPopSound(); // play when toggling on
    const newValue = !showPopup;
    setShowPopup(newValue);
    saveSetting('showPopup', newValue);
  };
  
  const toggleSound = () => {
    const newValue = !soundEnabled;
    if (newValue) playPopSound();
    setSoundEnabled(newValue);
    saveSetting('soundEnabled', newValue);
  };

  const changeFolderStructure = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setFolderStructure(newValue);
    saveSetting('folderStructure', newValue);
  };

  const changeRepoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setRepoName(newValue);
    saveSetting('github_repo', newValue);
  };
  
  const changeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUserName(newValue);
    saveSetting('userName', newValue);
  };

  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setTheme(newValue);
    saveSetting('theme', newValue);
  };

  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour >= 5 && hour < 12) greeting = 'Good Morning';
    else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17 && hour < 22) greeting = 'Good Evening';
    else greeting = 'Late night session? 🦉';

    if (userName && greeting.indexOf('Late') === -1) {
      return `${greeting}, ${userName}!`;
    }
    return greeting;
  };

  if (isLoading) {
    return (
      <div className={`app-container theme-${theme}`} style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '40px', marginBottom: '20px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ height: '160px', marginBottom: '16px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="app-container">
        <Particles />
        <header className="app-header glass-panel" style={{ zIndex: 1 }}>
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h1>Git Over It</h1>
          </div>
        </header>
        <div style={{ zIndex: 1, position: 'relative' }}>
          <SetupWizard onComplete={handleSetupComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container theme-${theme} ${isPulsing ? 'pulse-success' : ''}`}>
      <Particles />
      <div className="app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', zIndex: 1 }}>
        <h1 className="app-title" style={{ fontSize: '18px', margin: 0 }}>Git Over It</h1>
        <div className="status-indicator">
          <div className="glow-dot"></div>
          <span>In Sync</span>
        </div>
      </div>

      <nav className="app-nav" style={{ zIndex: 1 }}>
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
          Settings
        </button>
      </nav>

      <main className="app-main" style={{ zIndex: 1 }}>
        {activeTab === 'dashboard' ? (
          <>
            <div className="status-card glass-panel tilt-card" onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
              <h2 style={{ fontSize: '18px' }}>{getGreeting()}</h2>
              <p style={{ marginTop: '8px', lineHeight: '1.4' }}>Solve a problem on LeetCode and we'll automatically push it to your repository.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-box glass-panel tilt-card" onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
                <span className="stat-label">Streak</span>
                <span className="stat-value">🔥 0</span>
              </div>
              <div className="stat-box glass-panel tilt-card" onMouseMove={handleTilt} onMouseLeave={handleTiltLeave}>
                <span className="stat-label">Pushed</span>
                <span className="stat-value">🚀 {pushedCount}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="settings-panel glass-panel" style={{ padding: '16px' }}>
            <h2 style={{ marginBottom: '16px' }}>Preferences</h2>
            
            <div className="setting-item" style={{ marginBottom: '16px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>Success Popup</label>
                <InfoTooltip text="Show a notification on LeetCode when push succeeds" />
              </div>
              <label className="switch">
                <input type="checkbox" checked={showPopup} onChange={togglePopup} />
                <span className="slider round"></span>
              </label>
            </div>
            
            <div className="setting-item" style={{ marginBottom: '16px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>Sound Effects</label>
                <InfoTooltip text="Play a satisfying pop sound on success" />
              </div>
              <label className="switch">
                <input type="checkbox" checked={soundEnabled} onChange={toggleSound} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="setting-item" style={{ marginBottom: '16px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>Theme</label>
                <InfoTooltip text="Customize the UI aesthetics" />
              </div>
              <select className="setting-select" value={theme} onChange={changeTheme}>
                <option value="dark">Dark Mode</option>
                <option value="cute">Pastel Cute</option>
              </select>
            </div>
            
            <div className="setting-item" style={{ marginBottom: '16px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>User Name</label>
                <InfoTooltip text="Your name for personalized greetings" />
              </div>
              <input 
                type="text" 
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px', width: '130px', outline: 'none' }} 
                value={userName} 
                onChange={changeUserName} 
                placeholder="John Doe" 
              />
            </div>

            <div className="setting-item" style={{ marginBottom: '16px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>Target Repo</label>
                <InfoTooltip text="The GitHub repo to push solutions into" />
              </div>
              <input 
                type="text" 
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px', width: '130px', outline: 'none' }} 
                value={repoName} 
                onChange={changeRepoName} 
                placeholder="Git-Over-It" 
              />
            </div>

            <div className="setting-item" style={{ marginBottom: '8px' }}>
              <div className="setting-info" style={{ display: 'flex', alignItems: 'center' }}>
                <label>Organization</label>
                <InfoTooltip text="How your GitHub folders are structured" />
              </div>
              <select className="setting-select" value={folderStructure} onChange={changeFolderStructure}>
                <option value="template_a">Topic / Difficulty / Problem</option>
                <option value="template_b">Language / Difficulty / Problem</option>
                <option value="template_c">Difficulty / Problem</option>
                <option value="flat">Flat Problem List</option>
              </select>
            </div>
            {folderStructure !== 'flat' && (
              <div style={{ fontSize: '11px', color: '#e67e22', padding: '6px 8px', background: 'rgba(230, 126, 34, 0.1)', borderRadius: '6px', border: '1px solid rgba(230,126,34,0.2)' }}>
                ⚠️ Existing folders on GitHub won't be moved!
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer" style={{ zIndex: 1 }}>
        <p>
          {activeTab === 'dashboard' 
            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>Waiting for code <span className="typing-dots"><span></span><span></span><span></span></span></span> 
            : 'Git Over It v1.0.0'}
        </p>
      </footer>
    </div>
  )
}

export default App
