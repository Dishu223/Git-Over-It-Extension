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

## 🔜 What's Next?
Next up, I'll be implementing **Feature 1**, focusing on the User Interface. I want to add a Settings tab to configure custom folder routing and a Toast Notification so I know when my code is pushed successfully!
