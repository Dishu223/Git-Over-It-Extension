// @ts-ignore
import injectUrl from './inject.ts?script'

// ==============================================================================
// 1. INJECT THE SCRIPT VIA SRC TO BYPASS CSP
// ==============================================================================
const injectInterceptor = () => {
  const script = document.createElement('script');
  // @crxjs/vite-plugin will correctly bundle inject.ts and provide the URL here!
  script.src = chrome.runtime.getURL(injectUrl);
  script.onload = function() {
    (this as any).remove();
  };
  (document.head || document.documentElement).appendChild(script);
};

injectInterceptor();

// ==============================================================================
// 2. LISTEN FOR MESSAGES FROM THE INTERCEPTOR
// ==============================================================================
window.addEventListener('message', async (event) => {
  if (event.source !== window || !event.data) return;

  if (event.data.type === 'LEETCODE_SUBMISSION') {
    const submissionData = event.data.payload;
    
    const urlParts = window.location.pathname.split('/');
    const problemName = urlParts[2] || 'unknown-problem';

    console.log("Git Over It: Fetching advanced problem details for", problemName);

    // Advanced Scraper: Fetch the Problem Description, Difficulty, and Tags natively via GraphQL!
    let difficulty = 'Medium';
    let tags: string[] = [];
    let descriptionContent = '';

    try {
      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            difficulty
            content
            topicTags {
              name
            }
          }
        }
      `;
      
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
      };
      
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrftoken': getCookie('csrftoken') || ''
        },
        body: JSON.stringify({
          query: query,
          variables: { titleSlug: problemName }
        })
      });
      
      const resData = await res.json();
      const q = resData?.data?.question;
      if (q) {
        difficulty = q.difficulty || difficulty;
        descriptionContent = q.content || '';
        tags = q.topicTags?.map((t: any) => t.name) || [];
      }
    } catch (e) {
      console.error("Git Over It: Failed to fetch advanced problem details", e);
    }

    const cleanData = {
      problemName: problemName,
      language: submissionData.lang,
      code: submissionData.code,
      runtime: submissionData.status_runtime,
      memory: submissionData.status_memory,
      difficulty: difficulty,
      tags: tags,
      description: descriptionContent,
      timestamp: new Date().toISOString()
    };

    console.log("Git Over It Content Script: Forwarding rich data to Background Worker", cleanData);

    chrome.runtime.sendMessage({
      type: 'SUBMISSION_ACCEPTED',
      payload: cleanData
    });
  }
});

// ==============================================================================
// 3. LISTEN FOR SUCCESS FROM BACKGROUND WORKER TO SHOW TOAST
// ==============================================================================
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PUSH_SUCCESS') {
    chrome.storage.local.get(['showPopup'], (result) => {
      // Default to true if not set
      if (result.showPopup !== false) {
        showSuccessToast(message.problem);
      }
    });
  }
});

function showSuccessToast(problemName: string) {
  const styleId = 'git-over-it-toast-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .git-over-it-toast {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        background-color: #1e1e1e !important;
        border: 1px solid #333 !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        z-index: 2147483647 !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        transform: translateY(150px);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease !important;
        display: flex !important;
        flex-direction: column !important;
        color: white !important;
      }
      .git-over-it-toast.show {
        transform: translateY(0) !important;
        opacity: 1 !important;
      }
      .git-over-it-toast-content {
        padding: 16px 20px !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      .git-over-it-toast h4 { 
        margin: 0 !important; 
        color: #fff !important; 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
        font-size: 15px !important; 
        font-weight: 600 !important;
      }
      .git-over-it-toast p { 
        margin: 4px 0 0 0 !important; 
        color: #aaa !important; 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
        font-size: 13px !important; 
      }
      .git-over-it-toast-close {
        cursor: pointer !important;
        padding: 4px !important;
        margin-left: 12px !important;
        opacity: 0.6 !important;
        transition: opacity 0.2s !important;
      }
      .git-over-it-toast-close:hover {
        opacity: 1 !important;
      }
      .git-over-it-progress-bar {
        height: 4px !important;
        background-color: #2ecc71 !important;
        width: 100% !important;
        transform-origin: left !important;
        animation: git-over-it-progress 10s linear forwards !important;
      }
      @keyframes git-over-it-progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement('div');
  toast.className = 'git-over-it-toast';
  toast.innerHTML = `
    <div class="git-over-it-toast-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      <div>
        <h4>Git Over It</h4>
        <p>Successfully pushed ${problemName} to GitHub!</p>
      </div>
      <svg class="git-over-it-toast-close" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <div class="git-over-it-progress-bar"></div>
  `;
  
  document.body.appendChild(toast);

  // Close functionality
  const closeBtn = toast.querySelector('.git-over-it-toast-close');
  let timeoutId: any;
  
  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
    clearTimeout(timeoutId);
  };
  
  closeBtn?.addEventListener('click', removeToast);

  // Trigger reflow
  void toast.offsetWidth;
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Animate out after 10s
  timeoutId = setTimeout(removeToast, 10000);
}
