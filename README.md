# ⚡ CodeSense AI — Senior Engineer Code Review Platform

> Paste any code. Get a full staff-engineer-level review — security, bugs, performance, auto-fix, tests, and AI chat.

## 🎯 What Is This?

CodeSense AI is a full-stack AI platform that acts as a **Staff Engineer at Google reviewing your code**. You paste any code, it gives you:

- **Security Audit** — SQL injection, hardcoded secrets, XSS, command injection detection
- **Bug Detection** — Unhandled errors, type issues, logic bugs, race conditions
- **Performance Analysis** — N+1 queries, blocking calls, missing indexes
- **Overall Score** — 4-dimension scoring (Security, Performance, Complexity, Maintainability)
- **Bug Probability** — Estimated % chance this code breaks in production
- **Auto-Refactored Code** — AI rewrites your code with all issues fixed
- **Unit Test Generation** — Complete test suite generated for your code
- **AI Chat** — Ask the AI engineer follow-up questions about your code

---


## ✨ Features Deep Dive

### 🔍 AI Code Review (4 Analysis Modes)
The AI runs as a Staff Engineer persona with 15 years experience:
- Assigns line-specific issue markers
- Categorizes by: security, performance, bug, maintainability, style, best-practice
- Severity levels: critical / warning / suggestion / good
- Effort vs impact scoring per issue

### 🛡️ Security Detection
Detects OWASP Top 10 and more:
- SQL Injection (concatenated queries)
- Hardcoded API keys and passwords
- Command injection via `os.system()`
- Unsafe deserialization (`pickle.load`)
- Missing authentication checks
- Sensitive data in logs

### 📊 Multi-Dimension Scoring
```
Overall Score = weighted(Security + Performance + Complexity + Maintainability)
Bug Probability = estimated % chance of production failure
```

### ↔️ Diff Viewer
Side-by-side view of your original vs AI-refactored code, with:
- Syntax-colored original (red) and fixed (green) versions
- Single refactored view with copy button
- Line-by-line comparison mode

### 🧪 Test Generation
AI generates a complete unit test suite:
- Happy path tests
- Edge case tests
- Error scenario tests
- Uses the appropriate framework for the language

### 💬 AI Chat
Conversational Q&A with the AI engineer about your code:
- Full context of the review is maintained
- Ask for explanations, alternatives, or deeper dives
- Quick questions with one-click prompts

---

