import { useState } from 'react';
import { Copy, CheckCheck, X, Code2 } from 'lucide-react';

interface Props {
  original: string;
  refactored: string;
  language: string;
  onClose: () => void;
}

export default function DiffViewer({ original, refactored, language, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'refactored' | 'diff'>('refactored');

  function copy() {
    navigator.clipboard.writeText(refactored);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple diff: show side by side
  const origLines = original.split('\n');
  const refLines = refactored.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
      <div className="w-full max-w-5xl max-h-[85vh] flex flex-col glass-2 rounded-2xl border border-line/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line/50 bg-raised/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <Code2 size={15} className="text-lime" />
            <span className="font-display font-semibold text-text">AI-Refactored Code</span>
            <span className="pill tag-good ml-1">All Issues Fixed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-line/50 overflow-hidden">
              {(['refactored', 'diff'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-xs capitalize transition-all ${view === v ? 'bg-cyan/10 text-cyan' : 'text-dim hover:text-text'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime/10 border border-lime/20 text-lime text-xs hover:bg-lime/20 transition-all">
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-raised text-dim hover:text-text transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0">
          {view === 'refactored' ? (
            <div className="flex h-full">
              {/* Line numbers */}
              <div className="select-none text-right pr-3 pl-4 py-4 text-xs font-mono text-muted bg-ink/60 border-r border-line/40 shrink-0" style={{ minWidth: '3.5rem' }}>
                {refLines.map((_, i) => <div key={i} className="h-6 leading-6">{i + 1}</div>)}
              </div>
              <pre className="flex-1 py-4 px-4 text-xs font-mono text-lime leading-6 overflow-x-auto">
                {refactored}
              </pre>
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-line/40 h-full">
              {/* Original */}
              <div className="flex flex-col overflow-hidden">
                <div className="px-4 py-2 bg-rose/5 border-b border-line/40 text-xs text-rose font-mono shrink-0">
                  − Original ({origLines.length} lines)
                </div>
                <div className="flex flex-1 overflow-auto">
                  <div className="select-none text-right pr-3 pl-4 py-3 text-xs font-mono text-muted bg-ink/40 border-r border-line/40 shrink-0" style={{ minWidth: '3rem' }}>
                    {origLines.map((_, i) => <div key={i} className="h-5 leading-5">{i + 1}</div>)}
                  </div>
                  <pre className="flex-1 py-3 px-3 text-xs font-mono text-rose/70 leading-5 overflow-x-auto">
                    {original}
                  </pre>
                </div>
              </div>
              {/* Refactored */}
              <div className="flex flex-col overflow-hidden">
                <div className="px-4 py-2 bg-lime/5 border-b border-line/40 text-xs text-lime font-mono shrink-0">
                  + Refactored ({refLines.length} lines)
                </div>
                <div className="flex flex-1 overflow-auto">
                  <div className="select-none text-right pr-3 pl-4 py-3 text-xs font-mono text-muted bg-ink/40 border-r border-line/40 shrink-0" style={{ minWidth: '3rem' }}>
                    {refLines.map((_, i) => <div key={i} className="h-5 leading-5">{i + 1}</div>)}
                  </div>
                  <pre className="flex-1 py-3 px-3 text-xs font-mono text-lime leading-5 overflow-x-auto">
                    {refactored}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
