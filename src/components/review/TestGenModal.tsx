import { useState, useEffect } from 'react';
import { ReviewResult } from '@/utils/types';
import { X, TestTube, Copy, CheckCheck, Loader } from 'lucide-react';

interface Props {
  result: ReviewResult;
  onClose: () => void;
}

export default function TestGenModal({ result, onClose }: Props) {
  const [tests, setTests] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_tests', code: result.code, language: result.language }),
        });
        const data = await res.json();
        setTests(data.tests || '// Could not generate tests');
      } catch {
        setTests('// Error: Could not generate tests. Check your API key.');
      } finally {
        setLoading(false);
      }
    }
    generate();
  }, [result]);

  function copy() {
    navigator.clipboard.writeText(tests);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = tests.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[80vh] flex flex-col glass-2 rounded-2xl border border-line/60 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <TestTube size={15} className="text-violet" />
            <span className="font-display font-semibold text-text">AI-Generated Test Suite</span>
            <span className="pill" style={{ background: '#3b1f8022', color: '#a78bfa', border: '1px solid #3b1f8055' }}>
              {result.language.toUpperCase()}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet/10 border border-violet/20 text-violet text-xs hover:bg-violet/20 transition-all">
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-raised text-dim hover:text-text transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader size={20} className="text-violet animate-spin" />
              <p className="text-sm text-dim">Generating test suite...</p>
            </div>
          ) : (
            <div className="flex h-full">
              <div className="select-none text-right pr-3 pl-4 py-4 text-xs font-mono text-muted bg-ink/60 border-r border-line/40 shrink-0" style={{ minWidth: '3.5rem' }}>
                {lines.map((_, i) => <div key={i} className="h-5 leading-5">{i + 1}</div>)}
              </div>
              <pre className="flex-1 py-4 px-4 text-xs font-mono text-violet/80 leading-5 overflow-x-auto">
                {tests}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
