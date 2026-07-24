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
// We use TextEncoder to safely handle complex Unicode characters (emojis, math symbols).
const utf8ToBase64 = (str: string) => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
// 4. MOCK AI BACKEND PROXY (FEATURE 3)
// ==============================================================================
// The user doesn't need to provide a Gemini API key. This mock proxy simulates 
// a backend service that processes the rich LeetCode data and generates a professional README.
async function generateAIReadme(payload: any): Promise<string> {
  console.log("Git Over It: Contacting AI Backend Proxy...");
  
  // Simulate network latency (1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate realistic mock Time/Space complexity based on tags/language
  let timeComplexity = "O(N)";
  let spaceComplexity = "O(N)";
  
  if (payload.tags?.includes("Dynamic Programming")) {
    timeComplexity = "O(N^2)";
    spaceComplexity = "O(N)";
  } else if (payload.tags?.includes("Binary Search") || payload.tags?.includes("Tree")) {
    timeComplexity = "O(log N) or O(N log N)";
    spaceComplexity = "O(log N)";
  } else if (payload.tags?.includes("Two Pointers") || payload.tags?.includes("Sliding Window")) {
    timeComplexity = "O(N)";
    spaceComplexity = "O(1)";
  }

  const tagBadges = payload.tags?.length > 0 ? payload.tags.map((t: string) => `\`${t}\``).join(" ") : "`Algorithm`";
  const title = payload.problemName.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return `
# ${title}

> **Difficulty:** ${payload.difficulty || 'Medium'}
> **Topics:** ${tagBadges}
> **Language:** \`${payload.language}\`

## 🧠 AI Analysis & Rules Engine

### Complexity
- **Time Complexity:** \`${timeComplexity}\`
- **Space Complexity:** \`${spaceComplexity}\`

### Spaced Repetition (Active Recall)
To master this problem, it's recommended to review it again on:
- **1st Review:** ${(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)).toDateString()}
- **2nd Review:** ${(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toDateString()}
- **3rd Review:** ${(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toDateString()}

---

## 📝 Problem Description

<details>
<summary>Click to view</summary>

${payload.description || 'Description not available.'}

</details>

<br />
<hr />
<p align="right"><i>Generated automatically by Git Over It AI Engine</i></p>
`.trim();
}

// ==============================================================================
// 5. THE PUSHER (THE ENGINE)
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

    // C) Format the folder structure. 
    // We now create a dedicated folder for each problem!
    const extension = getFileExtension(payload.language);
    const problemFolder = `solutions/${payload.problemName}`;
    const codeFilePath = `${problemFolder}/solution.${extension}`;
    const readmeFilePath = `${problemFolder}/README.md`;

    // D) Prepare the Commit!
    const cleanName = payload.problemName.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const commitMessage = `Solved LeetCode : ${cleanName} (with AI Analysis)`;
    
    // Fetch the AI generated README!
    const generatedReadme = await generateAIReadme(payload);

    const filesToPush = [
      { path: codeFilePath, content: payload.code },
      { path: readmeFilePath, content: generatedReadme }
    ];

    let allSuccess = true;

    for (const file of filesToPush) {
      // Check if the file already exists to get its SHA (required for overwriting)
      let fileSha: string | undefined;
      try {
        const getRes = await fetch(`https://api.github.com/repos/${username}/Git-Over-It/contents/${file.path}`, {
          headers: { Authorization: `token ${token}` }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          fileSha = fileData.sha;
        }
      } catch (e) {}

      console.log(`Git Over It: Pushing ${file.path} to GitHub...`);

      const body: any = {
          message: commitMessage,
          content: utf8ToBase64(file.content),
      };
      if (fileSha) body.sha = fileSha;

      // E) Send the PUT request to create or update the file
      const pushRes = await fetch(`https://api.github.com/repos/${username}/Git-Over-It/contents/${file.path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!pushRes.ok) {
        allSuccess = false;
        const err = await pushRes.json();
        console.error("Git Over It: Push failed for", file.path, err);
      }
    }

    if (allSuccess) {
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
      console.error("Git Over It: Push failed for one or more files.");
    }

  } catch (error) {
    console.error("Git Over It: Background push error", error);
  }
}
