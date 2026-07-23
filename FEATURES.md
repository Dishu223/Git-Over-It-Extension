# Git Over It - Master Feature List 🚀

This document serves as the permanent record of all features planned for the **Git Over It** extension. 

## 🧠 AI & Intelligent Structuring
* **Pattern-Based Tagging:** Uses AI to detect the core algorithmic pattern (e.g., Two Pointers, Sliding Window) and builds folders accordingly.
* **Automated Alternative Solutions:** Instructs Gemini to generate an optimal secondary approach in the README.
* **Dynamic Folder Structure by Topic:** Automatically organizes your code into clean, algorithmic category folders in your GitHub repository, mapping to every Data Structure category present in LeetCode.
* **Custom Rule-Based Folder Routing:** A powerful, user-friendly UI (like a Smart List builder) allowing users to create custom rules (Match All/Any: Status, Difficulty, Topics, Language) to route specific solutions to exact folders.
* **Difficulty-Tiered Nesting:** Nests files inside difficulty folders (Easy, Medium, Hard) to structure your repo like an organized data structures textbook.
* **Multi-DS "Alternative Solution" Routing:** If a question applies to multiple data structures, pushes it to multiple folders with an "alternative solution" naming scheme.
* **Multi-Language Grouping:** Automatically categorizes solutions into subfolders based on the programming language used.
* **Smart Naming Conventions:** Formats filenames cleanly as `[problem name].[extension]` (e.g., `two-sum.cpp`).

## 📄 Documentation & Complexity
* **Time & Space Complexity Explainer:** Automatically injects a clean breakdown section detailing the Big-O performance.
* **Automatic README Documentation Generation:** Automatically generates a rich Markdown README for every pushed solution, including problem descriptions, constraints, and your code snippet.
* **Customizable README Templates:** Allows you to design custom Markdown templates using variables for titles, difficulties, and code snippets.
* **Advanced AI Summaries & Spaced Repetition:** The README includes an AI-generated guide for easy revision, tracks spaced repetition dates, and parses additional info explicitly mentioned by the user in code comments.

## ⚙️ Core Syncing Engine
* **Submission Status Filter:** Configures settings to *only* push solutions that achieve an "Accepted" verdict, ignoring compile errors or wrong answers completely.
* **Language-Specific File Extension Mapping:** Automatically detects the language chosen on LeetCode and assigns the correct extension (e.g., `.cpp` for C++, `.py` for Python) without manual configuration.
* **Natural Commit Messages for Solutions:** Generates human-readable, natural commit messages for user pushes (e.g., `Solved LeetCode 123 : Reverse String`).
* **Professional Project Commits:** (For the internal development of Git Over It) Strict adherence to standardized conventional commits.
* **Commit Author Customization:** Automatically configures the Git commit author details (matching your GitHub profile name and email) so your contribution graph correctly credits you.
* **Multi-Platform Support Expansion:** Built with an extensible architecture ready to support future platforms like Codeforces or HackerRank.

## 🛡️ Reliability & Security
* **Secure Token Storage (Chrome Sync/Local Storage):** Safely encrypts and stores your GitHub Personal Access Token (PAT) locally using Chrome’s secure storage API rather than hardcoding it.
* **Repository Initialization Wizard:** Includes a quick-setup onboarding screen inside the extension popup that automatically creates the required repository structure or checks permissions on your first use.
* **Offline Mode & Queueing:** Queues submissions locally if network errors occur and auto-syncs when reconnected.
* **Rate-Limit Management & Backoff:** Detects GitHub API rate limits (e.g., secondary rate limits or abuse detection) and safely delays or queues requests to prevent failed pushes.
* **Duplicate Prevention & Version Overwriting:** Checks if a solution for the problem already exists in your GitHub repo and updates/overwrites it only if your new submission has a better runtime or memory score.
* **Private vs. Public Repo Routing:** Lets you configure the extension to push experimental or non-accepted drafts to a private branch, while cleanly pushing accepted solutions straight to `main`.

## 🎨 User Experience (Extreme User Friendliness)
* **Top Priority - Ease of Use:** The entire application is designed with extreme user-friendliness as the north star. Every feature, flow, and README is crystal clear and highly polished.
* **Interactive Help & Instructions Tab:** A beautifully designed onboarding and instructions center that explains all features clearly so users can maximize the app's potential.
* **Streak & Progress Heatmap Widget:** Displays your current submission streak and recent progress inside the extension popup.
* **One-Click Local Sandbox Export:** Instantly downloads the solution file with pre-configured boilerplate driver code and a local `input.txt` so the folder is ready for local execution.
