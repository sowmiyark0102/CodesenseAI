import { useState, useCallback } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import CodeEditor from '@/components/editor/CodeEditor';
import ReviewPanel from '@/components/review/ReviewPanel';
import ChatPanel from '@/components/review/ChatPanel';
import DiffViewer from '@/components/review/DiffViewer';
import TestGenModal from '@/components/review/TestGenModal';
import { ReviewResult, Language } from '@/utils/types';
import { Zap, Loader, ChevronRight, AlertTriangle, Shield, Cpu, Code2, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

type RightPanel = 'review' | 'chat';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [filename, setFilename] = useState('main.js');
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>('review');
  const [showDiff, setShowDiff] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');

  async function runReview() {
    if (!code.trim()) return;
    setReviewing(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'review', code, language, filename }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const fullResult: ReviewResult = {
        id: `review_${Date.now()}`,
        timestamp: new Date(),
        filename,
        language,
        code,
        ...data,
      };
      setResult(fullResult);
      setRightPanel('review');

      // Save to history
      const stored = localStorage.getItem('codesense_history');
      const history = stored ? JSON.parse(stored) : [];
      history.unshift({
        id: fullResult.id,
        filename,
        language,
        score: fullResult.overallScore,
        issueCount: fullResult.issues.length,
        timestamp: new Date(),
      });
      localStorage.setItem('codesense_history', JSON.stringify(history.slice(0, 50)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Review failed');
    } finally {
      setReviewing(false);
    }
  }

  const highlightMap: Record<number, string> = {};
  if (result) {
    result.issues.forEach(issue => {
      highlightMap[issue.line] = issue.severity;
    });
  }

  function handleChat(q: string) {
    setChatQuestion(q);
    setRightPanel('chat');
  }

  return (
    <>
      <Head>
        <title>CodeSense AI — Senior Engineer Code Review</title>
      </Head>

      {/* Scan line */}
      <div className="scanline" />

      <div className="min-h-screen bg-ink flex flex-col" style={{ background: 'radial-gradient(ellipse at top left, #0d1220 0%, #07080c 60%)' }}>
        <Navbar />

        {/* Hero - shown when no result yet */}
        {!result && !reviewing && (
          <div className="max-w-3xl mx-auto px-5 pt-20 pb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-mono mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
              AI Model: claude-sonnet · Ready
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-bright mb-3 leading-tight">
              Your AI{' '}
              <span className="grad-cyan text-glow-cyan">Senior Engineer</span>
              <br />is waiting to review your code
            </h1>
            <p className="text-sm text-dim max-w-xl mx-auto leading-relaxed">
              Paste any code. Get a full staff-engineer-level code review — security holes, bugs, performance issues,
              refactored fix, generated tests, and an AI chat to answer any follow-up questions.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {[
                { icon: Shield, label: 'Security Analysis', color: 'text-rose' },
                { icon: Zap, label: 'Performance Review', color: 'text-amber' },
                { icon: AlertTriangle, label: 'Bug Detection', color: 'text-cyan' },
                { icon: Code2, label: 'Auto-Refactor', color: 'text-lime' },
                { icon: Cpu, label: 'Complexity Score', color: 'text-violet' },
                { icon: MessageSquare, label: 'AI Chat', color: 'text-soft' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-raised border border-line/60 text-xs text-dim">
                  <Icon size={11} className={color} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main editor + panel layout */}
        <div className={clsx(
          'flex flex-1 overflow-hidden',
          !result && !reviewing ? 'max-w-6xl mx-auto w-full px-5 pb-5' : 'px-4 pb-4'
        )}>
          {/* Left: Editor */}
          <div className={clsx(
            'flex flex-col transition-all duration-500',
            result ? 'flex-1 min-w-0 mr-4' : 'flex-1'
          )}>
            {/* Editor header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-dim font-mono">
                <span className="text-muted">//</span>
                <span>Editor</span>
                {code && <span className="text-cyan">· {code.split('\n').length} lines</span>}
              </div>
              <button
                onClick={runReview}
                disabled={!code.trim() || reviewing}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-display font-semibold text-sm transition-all duration-300',
                  reviewing
                    ? 'bg-raised border border-line text-dim cursor-not-allowed'
                    : code.trim()
                    ? 'bg-cyan text-ink hover:bg-cyan/90 glow-cyan animate-pulse-cyan'
                    : 'bg-raised border border-line/60 text-muted cursor-not-allowed'
                )}
              >
                {reviewing ? (
                  <><Loader size={14} className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Zap size={14} fill="currentColor" /> Run Review <ChevronRight size={14} /></>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-hidden rounded-xl" style={{ minHeight: result ? '500px' : '420px' }}>
              <CodeEditor
                code={code}
                language={language}
                filename={filename}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onFilenameChange={setFilename}
                highlightedLines={highlightMap}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-3 px-4 py-3 rounded-lg bg-rose/8 border border-rose/20 text-xs text-rose flex items-center gap-2">
                <AlertTriangle size={13} />
                {error}
              </div>
            )}

            {/* Loading state */}
            {reviewing && (
              <div className="mt-3 px-4 py-4 rounded-xl bg-raised border border-line/50 flex items-center gap-3">
                <div className="relative w-8 h-8 shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-cyan/20 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                    <Loader size={14} className="text-cyan animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Analyzing your code...</p>
                  <p className="text-xs text-dim">Running security scan, complexity analysis, bug detection...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Review + Chat panels */}
          {result && (
            <div className="w-[380px] shrink-0 flex flex-col glass-1 rounded-xl border border-line/60 overflow-hidden" style={{ maxHeight: 'calc(100vh - 5rem)' }}>
              {/* Panel toggle */}
              <div className="flex border-b border-line/50 shrink-0">
                {(['review', 'chat'] as const).map(panel => (
                  <button
                    key={panel}
                    onClick={() => setRightPanel(panel)}
                    className={clsx(
                      'flex-1 py-2.5 text-xs font-medium capitalize flex items-center justify-center gap-1.5 transition-all',
                      rightPanel === panel ? 'text-cyan bg-cyan/5 border-b-2 border-cyan' : 'text-dim hover:text-soft'
                    )}
                  >
                    {panel === 'review' ? <><AlertTriangle size={11} /> Review ({result.issues.length})</> : <><MessageSquare size={11} /> Chat</>}
                  </button>
                ))}
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-hidden min-h-0">
                {rightPanel === 'review' ? (
                  <ReviewPanel
                    result={result}
                    onLineSelect={setHighlightedLine}
                    onShowRefactored={() => setShowDiff(true)}
                    onGenerateTests={() => setShowTests(true)}
                    onChat={handleChat}
                  />
                ) : (
                  <ChatPanel result={result} initialQuestion={chatQuestion} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDiff && result?.refactoredCode && (
        <DiffViewer
          original={result.code}
          refactored={result.refactoredCode}
          language={result.language}
          onClose={() => setShowDiff(false)}
        />
      )}
      {showTests && result && (
        <TestGenModal result={result} onClose={() => setShowTests(false)} />
      )}
    </>
  );
}
