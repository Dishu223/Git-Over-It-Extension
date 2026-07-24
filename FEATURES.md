# Git Over It - Feature Roadmap

This document serves as the master list of all features we planned to implement, ensuring nothing is lost as the project grows.

## 🟢 Phase 1-3: The Working MVP (COMPLETED)
- **Repository Initialization Wizard**: A quick-setup onboarding screen that automatically creates the required repository structure or checks permissions on first use.
- **Submission Status Filter**: Configures settings to *only* push solutions that achieve an "Accepted" verdict, ignoring compile errors or wrong answers.
- **Robust Scraper**: Network interceptors that cleanly capture both REST and GraphQL submissions natively without fragile HTML parsing.
- **Automated GitHub Pusher**: Securely pushes the captured code directly to the GitHub API, handling overwriting via SHA checks.

## 🔵 Phase 4: AI & Quality of Life (QOL) Updates (UP NEXT)
- **Dynamic Folder Structure by Topic**: Automatically organizes your code into clean, algorithmic category folders in your GitHub repository.
- **Difficulty-Tiered Nesting**: Nests files inside difficulty folders (Easy, Medium, Hard) to structure your repo like an organized data structures textbook.
- **Smart Naming Conventions**: Formats filenames uniformly (e.g., `0001-two-sum.cpp`) instead of messy default IDs.
- **Multi-Language Grouping**: Automatically categorizes solutions into subfolders based on the programming language used.
- **Pattern-Based Tagging**: Uses AI to detect the core algorithm pattern used in your code.
- **Multi-DS Folder Mirroring**: If a question involves multiple Data Structures (e.g., solved with a Hash Map but LC expects a Tree), push the solution to *both* folders (e.g., `alternative solution - reverse bits`).
- **Customizable Push Locations**: Extension UI option giving the user manual control over exactly which folder the solutions are committed to.
- **AI-Powered README Generation**: Every pushed solution will include a beautifully generated README.md containing:
  1. Complete LeetCode description of the problem.
  2. Time and Space Complexity clearly analyzed.
# Git Over It - Feature Roadmap

This document serves as the master list of all features we planned to implement, ensuring nothing is lost as the project grows.

## 🟢 Phase 1-3: The Working MVP (COMPLETED)
- **Repository Initialization Wizard**: A quick-setup onboarding screen that automatically creates the required repository structure or checks permissions on first use.
- **Submission Status Filter**: Configures settings to *only* push solutions that achieve an "Accepted" verdict, ignoring compile errors or wrong answers.
- **Robust Scraper**: Network interceptors that cleanly capture both REST and GraphQL submissions natively without fragile HTML parsing.
- **Automated GitHub Pusher**: Securely pushes the captured code directly to the GitHub API, handling overwriting via SHA checks.

## 🔵 Phase 4: AI & Quality of Life (QOL) Updates (UP NEXT)
- **Dynamic Folder Structure by Topic**: Automatically organizes your code into clean, algorithmic category folders in your GitHub repository.
- **Difficulty-Tiered Nesting**: Nests files inside difficulty folders (Easy, Medium, Hard) to structure your repo like an organized data structures textbook.
- **Smart Naming Conventions**: Formats filenames uniformly (e.g., `0001-two-sum.cpp`) instead of messy default IDs.
- **Multi-Language Grouping**: Automatically categorizes solutions into subfolders based on the programming language used.
- **Pattern-Based Tagging**: Uses AI to detect the core algorithm pattern used in your code.
- **Multi-DS Folder Mirroring**: If a question involves multiple Data Structures (e.g., solved with a Hash Map but LC expects a Tree), push the solution to *both* folders (e.g., `alternative solution - reverse bits`).
- **Customizable Push Locations**: Extension UI option giving the user manual control over exactly which folder the solutions are committed to.
- **AI-Powered README Generation**: Every pushed solution will include a beautifully generated README.md containing:
  1. Complete LeetCode description of the problem.
  2. Time and Space Complexity clearly analyzed.
  3. An AI summary/guide of the solution written by the user for easy revision.
  4. Spaced repetition revision dates dynamically calculated.
  5. Any additional info parsed from the user's comments in the code.
- **Extremely User-Friendly UI**: Detailed instructions inside the extension popup explaining all features and capabilities.

## 🔮 Phase 5+: Future Monetization & Gamification (Backlog)
- **Daily Reminders System:** Use `chrome.alarms` and `chrome.notifications` to send users a desktop push notification if they haven't maintained their streak by a certain time (e.g., 8:00 PM).
- **Gamification & Credits:** Introduce a virtual economy where users earn credits by maintaining coding streaks, solving daily challenge problems, or optionally viewing ads.
- **Unlockable Cosmetics Store:** Users can spend their credits to buy custom UI themes for the extension, premium AI README templates, and algorithm cheat sheets!
- **Topic Replication Option:** Allow users to choose whether to push a solution to ALL topic folders mentioned by LeetCode (e.g., Array, String, Hashmap) or just the primary topic folder they used to solve it.
