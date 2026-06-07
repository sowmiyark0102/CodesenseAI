# ⚡ CodeSense AI — Senior Engineer Code Review Platform

> Paste any code. Get a full staff-engineer-level review — security, bugs, performance, auto-fix, tests, and AI chat.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Claude AI](https://img.shields.io/badge/Claude_Sonnet-AI-orange?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)

---

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

## 🏗️ Architecture

```
codesense/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Main review interface (3-panel IDE layout)
│   │   ├── history.tsx            # Review history with score trend chart
│   │   ├── learn.tsx              # Code quality education hub
│   │   └── api/
│   │       └── review.ts          # Anthropic API — 4 AI actions
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ui/
│   │   │   ├── ScoreRing.tsx      # SVG animated score rings
│   │   │   └── IssueBadge.tsx     # Severity tag badges
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx     # Custom code editor with line highlighting
│   │   └── review/
│   │       ├── ReviewPanel.tsx    # Issues, scores, strengths with filters
│   │       ├── ChatPanel.tsx      # Real-time AI chat about the code
│   │       ├── DiffViewer.tsx     # Side-by-side diff of original vs fixed
│   │       └── TestGenModal.tsx   # AI-generated test suite viewer
│   ├── utils/
│   │   ├── types.ts
│   │   └── samples.ts             # Intentionally buggy demo code
│   └── styles/globals.css
└── README.md
```

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

## 🚀 Quick Start

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/codesense-ai.git
cd codesense-ai
npm install
```

### 2. Configure API Key
```bash
cp .env.local.example .env.local
# Edit .env.local → add your ANTHROPIC_API_KEY
# Get key from: https://console.anthropic.com
```

### 3. Run
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Try it out
- Click **Load Sample** in the editor to load intentionally buggy code
- Click **Run Review** to get the AI analysis
- Explore issues, click **View Fixed Code**, **Generate Tests**, **Ask AI**

---

## 🚢 Deploy to Vercel

```bash
npm i -g vercel
vercel
# Add ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

---

## 🎓 Why FAANG Interviewers Love This

| What They See | Why It Matters |
|---|---|
| Real AI integration | Not a tutorial project — actual LLM engineering |
| Security domain knowledge | Shows OWASP/security awareness |
| 3-panel IDE-like layout | Advanced UI/UX thinking |
| Streaming AI responses | Understanding of async patterns |
| Score algorithms | Systems thinking |
| History + analytics | Full product, not just a demo |
| TypeScript strict mode | Production code quality |

---

## 📄 License

MIT — free to use for learning and portfolio purposes.

---

Built with ⚡ by a CS Engineering student targeting FAANG
