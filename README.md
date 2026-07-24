# Git Over It - LeetCode to GitHub Sync

Hey there! 👋 Welcome to the development journal of **Git Over It**, my smart Chrome Extension that automatically syncs accepted LeetCode solutions directly to GitHub. I built this to automate my portfolio generation while solving algorithms. 

Here is a detailed log of my development journey, the hurdles I faced, and how I engineered solutions for them!

---

## 🟢 Phase 1-3: The Working MVP & Overcoming LeetCode's Architecture
*(Development Period: July 21 - July 23)*

Building the core engine wasn't as straightforward as just writing a script. I ran into several major engineering challenges right off the bat, but managed to build a highly robust MVP by solving them one by one:

**1. The Content Security Policy (CSP) Block**
Initially, I tried to inject an inline script into LeetCode to listen for network requests. LeetCode's strict Content Security Policy (CSP) immediately blocked it for being an "unsafe-inline" script. 
* **The Solution:** I refactored the extension to bundle a standalone script (`inject.ts`) and declared it in the manifest under `web_accessible_resources`. By injecting a `<script src="...">` tag pointing to my own secure extension file, I completely bypassed the CSP restrictions!

**2. The Silent API Shift (REST to GraphQL)**
After bypassing CSP, the scraper was still failing to catch code submissions. After digging into the Developer Console, I discovered LeetCode had recently overhauled their entire platform architecture! They deprecated their old `/submit/` REST API and moved to a modern GraphQL endpoint.
* **The Solution:** I rebuilt the network interceptor to natively intercept both `fetch` and `XMLHttpRequest`. I added custom parsing logic to intercept the POST payload on its way out to `/graphql`, dynamically extract the `variables.typedCode`, and hold onto it until the server responded with a `statusCode: 10` (Accepted). 

**3. The GitHub Overwrite Crash**
When I tested pushing code to GitHub, the very first push succeeded, but subsequent pushes crashed silently! GitHub's API returned a `422 Unprocessable Entity`. 
* **The Solution:** GitHub's API requires a file's unique `sha` signature if you are trying to overwrite an existing file. I updated the Service Worker (`background.ts`) to perform a pre-flight `GET` request to check if the file already exists. If it does, it grabs the `sha` and includes it in the `PUT` request, allowing safe and seamless file overwriting!

---

## 🛠️ Feature 1: Extension Settings UI & Toast Notifications
*(Development Period: July 24)*

I decided the extension needed to be extremely user-friendly. Today, I added our first major Quality of Life features!

* **The Settings Tab ⚙️:** I built a sleek navigation system in the extension popup. These preferences are securely cached in Chrome Local Storage.
* **The Success Toast 🍞:** Instead of forcing the user to open the extension popup to verify if a push succeeded, the Service Worker now sends a success signal back to the active LeetCode tab. The Content Script listens for this and injects a beautifully animated green Toast Notification into the bottom right corner of the screen! (There's also a toggle in the Settings to turn this off if you prefer silence).

---

## 🧠 Feature 2: The Advanced Scraper
*(Development Period: July 24)*

Before we can use AI to categorize our solutions, we need more data! The scraper previously only grabbed the raw code and the language. 

Today, I upgraded the Content Script to fire a background GraphQL query to LeetCode's `questionData` endpoint the exact moment you hit submit. Without scraping a single line of fragile HTML, the extension now natively extracts:
1. **The Full Problem Description** (HTML formatted)
2. **The Difficulty Level** (Easy, Medium, Hard)
3. **The Topic Tags** (e.g., Array, Hash Table, Dynamic Programming)

This rich data payload is seamlessly forwarded to the background worker, setting the perfect foundation for our upcoming AI engine!

---

## 🤖 Feature 3: The AI Rules Engine (README Generator)
*(Development Period: July 25)*

This is where the magic happens! I wanted the extension to automatically generate a beautiful, markdown README for every problem I solve, detailing the time and space complexity, the tags, and active recall dates. 

Since Chrome Extensions shouldn't bundle raw API keys for security reasons, I engineered a highly robust Mock AI Backend Proxy. It instantly parses the rich data from Feature 2, calculates an intelligent mock Time/Space complexity based on algorithm families (e.g. Dynamic Programming -> O(N^2), Binary Search -> O(log N)), and generates a complete README!

Now, when you push a solution, it actually creates a dedicated folder for that problem on GitHub containing BOTH the solution code and the generated `README.md`!

---

## 🔜 What's Next?
Next up is **Feature 4: Dynamic Folder Organization UI**. We will wire up the Settings tab so the AI proxy can sort solutions into folders by Difficulty, Language, or Data Structure instead of just the problem name!
