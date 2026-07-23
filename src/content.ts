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
window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data) return;

  if (event.data.type === 'LEETCODE_SUBMISSION') {
    const submissionData = event.data.payload;
    
    const urlParts = window.location.pathname.split('/');
    const problemName = urlParts[2] || 'unknown-problem';

    const cleanData = {
      problemName: problemName,
      language: submissionData.lang,
      code: submissionData.code,
      runtime: submissionData.status_runtime,
      memory: submissionData.status_memory,
      timestamp: new Date().toISOString()
    };

    console.log("Git Over It Content Script: Forwarding to Background Worker", cleanData);

    chrome.runtime.sendMessage({
      type: 'SUBMISSION_ACCEPTED',
      payload: cleanData
    });
  }
});
