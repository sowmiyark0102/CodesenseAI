import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Shield, Zap, Wrench, Bug, BookOpen, ExternalLink } from 'lucide-react';

const TOPICS = [
  {
    icon: Shield,
    color: '#fb7185',
    title: 'Security Vulnerabilities',
    description: 'The most critical issues that can compromise your application',
    items: [
      { name: 'SQL Injection', desc: 'Never concatenate user input into SQL queries. Use parameterized queries or ORMs.', example: "// ❌ Bad\ndb.query(`SELECT * FROM users WHERE id = ${userId}`);\n\n// ✅ Good\ndb.query('SELECT * FROM users WHERE id = ?', [userId]);" },
      { name: 'Hardcoded Secrets', desc: 'API keys, passwords, and tokens must never be in source code.', example: "// ❌ Bad\nconst apiKey = 'sk-prod-abc123';\n\n// ✅ Good\nconst apiKey = process.env.API_KEY;" },
      { name: 'Command Injection', desc: 'Never pass user input to shell commands without sanitization.', example: "// ❌ Bad (Python)\nos.system('mkdir -p ' + user_path)\n\n// ✅ Good\nsubprocess.run(['mkdir', '-p', user_path], check=True)" },
    ],
  },
  {
    icon: Zap,
    color: '#fbbf24',
    title: 'Performance Anti-Patterns',
    description: 'Common patterns that kill application performance',
    items: [
      { name: 'N+1 Query Problem', desc: 'Fetching related data in a loop causes N+1 database queries. Use batch fetching or joins.', example: "// ❌ Bad — N+1 queries\nfor (const user of users) {\n  const posts = await db.getPosts(user.id); // 1 query per user\n}\n\n// ✅ Good — 1 query\nconst posts = await db.getPostsByUserIds(userIds);" },
      { name: 'Blocking the Event Loop', desc: 'Heavy computation in the main thread blocks all other requests in Node.js.', example: "// ❌ Bad\napp.get('/compute', (req, res) => {\n  const result = heavySync(); // blocks!\n  res.json(result);\n});\n\n// ✅ Good\napp.get('/compute', async (req, res) => {\n  const result = await runInWorker(heavy);\n  res.json(result);\n});" },
      { name: 'Missing Indexes', desc: 'Queries without indexed columns result in full table scans.', example: "-- ❌ Bad: full table scan\nSELECT * FROM orders WHERE customer_email = 'test@example.com';\n\n-- ✅ Good: create index\nCREATE INDEX idx_orders_email ON orders(customer_email);" },
    ],
  },
  {
    icon: Bug,
    color: '#00d4ff',
    title: 'Common Bug Patterns',
    description: 'Bugs that sneak into production code',
    items: [
      { name: 'Unhandled Promise Rejections', desc: 'Async errors without catch handlers crash Node.js in production.', example: "// ❌ Bad\nasync function getData() {\n  const data = await fetch('/api/data'); // can throw!\n  return data.json();\n}\n\n// ✅ Good\nasync function getData() {\n  try {\n    const data = await fetch('/api/data');\n    return await data.json();\n  } catch (err) {\n    logger.error(err);\n    throw new AppError('Failed to fetch data');\n  }\n}" },
      { name: 'Type Coercion Bugs', desc: 'JavaScript loose equality leads to unexpected behavior.', example: "// ❌ Bad\nif (userId == null) // catches undefined AND null AND 0!\n\n// ✅ Good\nif (userId === null || userId === undefined)" },
    ],
  },
  {
    icon: Wrench,
    color: '#a3e635',
    title: 'Maintainability Principles',
    description: 'Write code your future self will thank you for',
    items: [
      { name: 'Single Responsibility', desc: 'Each function/class should do one thing only. If you need "and" to describe it, split it.', example: "// ❌ Bad — does 3 things\nfunction processAndSaveAndEmailUser(data) { ... }\n\n// ✅ Good\nconst user = parseUserData(data);\nawait saveUser(user);\nawait sendWelcomeEmail(user);" },
      { name: 'Magic Numbers', desc: 'Replace unexplained numbers with named constants.', example: "// ❌ Bad\nif (retries > 3) { ... }\nsetTimeout(fn, 86400000);\n\n// ✅ Good\nconst MAX_RETRIES = 3;\nconst ONE_DAY_MS = 24 * 60 * 60 * 1000;\nif (retries > MAX_RETRIES) { ... }" },
    ],
  },
];

const RESOURCES = [
  { title: 'OWASP Top 10', desc: 'Industry standard for web security risks', url: 'https://owasp.org/www-project-top-ten/', color: '#fb7185' },
  { title: 'Clean Code by Robert Martin', desc: 'The bible of writing maintainable code', url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882', color: '#a3e635' },
  { title: 'Google Engineering Practices', desc: "Google's internal code review standards, open-sourced", url: 'https://google.github.io/eng-practices/', color: '#00d4ff' },
  { title: 'The Pragmatic Programmer', desc: 'Timeless principles for software craftsmanship', url: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/', color: '#fbbf24' },
];

export default function LearnPage() {
  return (
    <>
      <Head><title>CodeSense AI — Learn</title></Head>
      <div className="scanline" />
      <div className="min-h-screen bg-ink" style={{ background: 'radial-gradient(ellipse at bottom, #0d1220 0%, #07080c 60%)' }}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-5 pt-20 pb-16">
          <div className="mb-10 stagger">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-cyan" />
              <span className="text-xs text-dim font-mono">KNOWLEDGE BASE</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-bright mb-2">Learn Code Quality</h1>
            <p className="text-sm text-dim max-w-xl leading-relaxed">
              The patterns CodeSense AI detects — explained with examples. Study these to write production-grade code that passes FAANG bar.
            </p>
          </div>

          {/* Topics */}
          <div className="space-y-8 stagger">
            {TOPICS.map(({ icon: Icon, color, title, description, items }) => (
              <div key={title} className="glass-1 rounded-2xl border border-line/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-line/50 flex items-center gap-3" style={{ background: `${color}06` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-text text-sm">{title}</h2>
                    <p className="text-xs text-dim">{description}</p>
                  </div>
                </div>
                <div className="divide-y divide-line/30">
                  {items.map(item => (
                    <div key={item.name} className="px-5 py-4">
                      <h3 className="font-display font-medium text-sm text-text mb-1.5">{item.name}</h3>
                      <p className="text-xs text-dim leading-relaxed mb-3">{item.desc}</p>
                      <pre className="text-xs font-mono text-soft bg-ink rounded-lg p-3 border border-line/40 overflow-x-auto leading-5">
                        {item.example}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="mt-10">
            <h2 className="font-display font-semibold text-text mb-4 text-sm">📚 Further Reading</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {RESOURCES.map(({ title, desc, url, color }) => (
                <a
                  key={title}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-1 rounded-xl border border-line/50 p-4 flex items-start gap-3 lift"
                >
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-medium text-sm text-text mb-0.5">{title}</p>
                    <p className="text-xs text-dim leading-relaxed">{desc}</p>
                  </div>
                  <ExternalLink size={13} className="text-muted shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
