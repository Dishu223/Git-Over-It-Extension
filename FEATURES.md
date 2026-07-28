# Git Over It - Feature Roadmap

This document serves as the master list of all features we planned to implement, ensuring nothing is lost as the project grows.

## 🟢 Completed Features (MVP & V1.0)
- **Dynamic Folder Structure by Topic**: Automatically organizes your code into clean, algorithmic category folders in your GitHub repository.
- **Difficulty-Tiered Nesting**: Nests files inside difficulty folders (Easy, Medium, Hard).
- **Smart Naming Conventions**: Formats filenames uniformly.
- **Multi-Language Grouping**: Automatically categorizes solutions into subfolders based on the programming language used.
- **Pattern-Based Tagging**: Detects the core algorithm pattern used in your code (using GraphQL topic tags).
- **Time & Space Complexity Explainer**: Automatically injects a clean breakdown section detailing the Big-O performance.
- **Streak & Progress Heatmap Widget**: Displays your current submission streak and recent progress inside the extension popup.
- **Professional Git Commit Messages**: Generates precise, standardized commit messages.
- **Automatic README Documentation Generation**: Automatically generates a rich Markdown README for every pushed solution.
- **Language-Specific File Extension Mapping**: Automatically detects the language chosen on LeetCode and assigns the correct extension.
- **Secure Token Storage (Chrome Sync/Local Storage)**: Safely stores your GitHub Personal Access Token locally.
- **Commit Author Customization**: Automatically configures the Git commit author details matching your GitHub profile.
- **Submission Status Filter**: Configures settings to *only* push solutions that achieve an "Accepted" verdict.
- **Repository Initialization Wizard**: Includes a quick-setup onboarding screen inside the extension popup.

## 🚀 QOL Updates V2.0 (To Do)
- **Automated Alternative Solutions**: Instructs Gemini to generate an optimal secondary approach in the README.
- **One-Click Local Sandbox Export**: Instantly downloads the solution file with pre-configured boilerplate code for local testing.
- **Customizable README Templates**: Allows you to design custom Markdown templates using variables for titles, difficulties, and code snippets.
- **Offline Mode & Queueing**: Queues submissions locally if network errors occur and auto-syncs when reconnected.
- **Multi-Platform Support Expansion**: Built with an extensible architecture ready to support future platforms like Codeforces or HackerRank.
- **Boilerplate & Test Case Inclusion**: Pushes not just your solution, but also includes a local `input.txt` or boilerplate driver code so the folder is ready for local execution.
- **Duplicate Prevention & Version Overwriting**: Checks if a solution for the problem already exists in your GitHub repo and updates/overwrites it only if your new submission has a better runtime or memory score.
- **Private vs. Public Repo Routing**: Lets you configure the extension to push experimental or non-accepted drafts to a private branch, while cleanly pushing accepted solutions straight to `main`.
- **Rate-Limit Management & Backoff**: Detects GitHub API rate limits (e.g., secondary rate limits or secondary abuse detection) and safely delays or queues requests to prevent failed pushes.

## 🔮 Phase 5+: Future Monetization & Gamification (Backlog)
- **Daily Reminders System:** Use `chrome.alarms` and `chrome.notifications` to send users a desktop push notification if they haven't maintained their streak by a certain time (e.g., 8:00 PM).
- **Gamification & Credits:** Introduce a virtual economy where users earn credits by maintaining coding streaks, solving daily challenge problems, or optionally viewing ads.
- **Unlockable Cosmetics Store:** Users can spend their credits to buy custom UI themes for the extension, premium AI README templates, and algorithm cheat sheets!
- **Topic Replication Option:** Allow users to choose whether to push a solution to ALL topic folders mentioned by LeetCode (e.g., Array, String, Hashmap) or just the primary topic folder they used to solve it.
