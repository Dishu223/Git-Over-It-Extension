// ==============================================================================
// 1. HELPER: EXTENSION MAPPING
// ==============================================================================
// We will expand this list in Phase 5, but here is the core logic!
const getFileExtension = (lang: string) => {
  const map: Record<string, string> = {
    cpp: 'cpp',
    java: 'java',
    python: 'py',
    python3: 'py',
    c: 'c',
    csharp: 'cs',
    javascript: 'js',
    typescript: 'ts',
    rust: 'rs',
    golang: 'go',
  };
  return map[lang] || 'txt';
};

// ==============================================================================
// 2. HELPER: BASE64 ENCODING
// ==============================================================================
// The GitHub API requires all file content to be sent encoded in Base64.
// btoa() is a built-in browser function for this!
const utf8ToBase64 = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)));
};

// ==============================================================================
// 3. LISTEN FOR SCRAPER MESSAGES
// ==============================================================================
chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (message.type === 'SUBMISSION_ACCEPTED') {
    console.log("Git Over It: Background Worker received submission!", message.payload);
    
    // We run the async push process in the background without blocking the browser.
    pushToGitHub(message.payload, _sender.tab?.id);
    
    // Immediately tell the scraper we received it.
    sendResponse({ status: "processing" });
  }
  return true;
});

// ==============================================================================
// 4. THE PUSHER (THE ENGINE)
// ==============================================================================
async function pushToGitHub(payload: any, tabId?: number) {
  try {
    // A) Get the PAT stored securely in Chrome Storage
    const data = await chrome.storage.local.get(['github_pat']);
    const token = data.github_pat;

    if (!token) {
      console.error("Git Over It: No GitHub Token found! Cannot push.");
      return;
    }

    // B) Figure out exactly who we are pushing as
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` }
    });
    const userData = await userRes.json();
    const username = userData.login;

    // C) Format the filename. (e.g. "two-sum.cpp")
    // Note: In Phase 4 we will add the "Dynamic Folder Structure" logic here!
    const extension = getFileExtension(payload.language);
    const filename = `${payload.problemName}.${extension}`;
    const filePath = `solutions/${filename}`; // Temp folder until Phase 4 AI sorting!

    // D) Prepare the Commit!
    // We use a natural, human-readable commit message for the user's repository.
    // e.g., "Solved LeetCode: two-sum"
    // Wait, the user asked for "Solved Leetcode 123 : Reverse String". 
    // We don't currently scrape the question number, but we can do our best with the name.
    const cleanName = payload.problemName.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const commitMessage = `Solved LeetCode : ${cleanName}`;
    const encodedCode = utf8ToBase64(payload.code);

    // Check if the file already exists to get its SHA (required for overwriting)
    let fileSha: string | undefined;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${username}/Git-Over-It/contents/${filePath}`, {
        headers: { Authorization: `token ${token}` }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        fileSha = fileData.sha;
      }
    } catch (e) {}

    console.log(`Git Over It: Pushing ${filePath} to GitHub...`);

    const body: any = {
        message: commitMessage,
        content: encodedCode,
    };
    if (fileSha) body.sha = fileSha;

    // E) Send the PUT request to create or update the file
    const pushRes = await fetch(`https://api.github.com/repos/${username}/Git-Over-It/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (pushRes.ok) {
      console.log("Git Over It: 🎉 Successfully pushed to GitHub!");
      // Hook this up to the UI streak widget!
      const stats = await chrome.storage.local.get(['pushedCount']);
      const count = ((stats.pushedCount as number) || 0) + 1;
      await chrome.storage.local.set({ pushedCount: count });

      // Notify the content script so it can show the LeetCode toast popup!
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: 'PUSH_SUCCESS', problem: payload.problemName });
      }
    } else {
      const err = await pushRes.json();
      console.error("Git Over It: Push failed", err);
    }

  } catch (error) {
    console.error("Git Over It: Background push error", error);
  }
}
