import { useState } from 'react';
import './SetupWizard.css';

interface SetupWizardProps {
  onComplete: (token: string) => void;
}

export default function SetupWizard({ onComplete }: SetupWizardProps) {
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!token) {
      setError('Please enter a valid token.');
      return;
    }
    
    setIsVerifying(true);
    setError('');
    setStatusText('Verifying token...');

    try {
      // Step 1: Verify the token with GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
      });

      if (!userResponse.ok) {
        throw new Error('Invalid GitHub Token');
      }

      const userData = await userResponse.json();
      const username = userData.login;
      
      setStatusText(`Authenticated as ${username}. Checking repository...`);

      // Step 2: Check if 'Git-Over-It' repository exists
      const repoName = 'Git-Over-It';
      const repoCheckResponse = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      // Step 3: If it doesn't exist (404), create it!
      if (repoCheckResponse.status === 404) {
        setStatusText('Creating Git-Over-It repository...');
        const createRepoResponse = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: repoName,
            description: 'My LeetCode solutions, automatically synced by Git Over It Chrome Extension 🚀',
            private: false, // Or true, depending on user preference later!
            auto_init: true // Creates an initial commit with a README
          })
        });

        if (!createRepoResponse.ok) {
          throw new Error('Failed to create repository. Does your token have "repo" scope?');
        }
      } else if (!repoCheckResponse.ok) {
        throw new Error('Failed to check repository status.');
      }

      setStatusText('All set! Redirecting...');
      
      // Short delay so the user can see the success message
      setTimeout(() => {
        onComplete(token);
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="setup-wizard glass-panel">
      <h2>🚀 Let's get connected!</h2>
      <p>To automatically push your LeetCode solutions, Git Over It needs a GitHub Personal Access Token (PAT).</p>
      
      <div className="input-group">
        <label htmlFor="pat-input">GitHub PAT</label>
        <input
          id="pat-input"
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxx"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={isVerifying}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {/* We added a status text so the user knows what step we are on! */}
      {statusText && !error && <div className="status-message" style={{color: 'var(--cta)', fontSize: '13px'}}>{statusText}</div>}

      <button 
        className="primary-btn" 
        onClick={handleSave}
        disabled={isVerifying}
      >
        {isVerifying ? 'Processing...' : 'Connect to GitHub'}
      </button>

      <div className="help-text">
        <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer">
          Click here to create a token
        </a>
        <br />
        (Select the <strong>repo</strong> scope)
      </div>
    </div>
  );
}
