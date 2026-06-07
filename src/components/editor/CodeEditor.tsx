import { useRef } from 'react';
import { Language } from '@/utils/types';
import { SAMPLE_CODES } from '@/utils/samples';
import { FileCode, ChevronDown, FlaskConical } from 'lucide-react';
import clsx from 'clsx';

const LANGUAGES: Language[] = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust'];

const LANG_ICONS: Record<Language, string> = {
  javascript: '🟨',
  typescript: '🟦',
  python:     '🐍',
  java:       '☕',
  cpp:        '⚙️',
  go:         '🐹',
  rust:       '🦀',
};

interface Props {
  code: string;
  language: Language;
  filename: string;
  onCodeChange: (c: string) => void;
  onLanguageChange: (l: Language) => void;
  onFilenameChange: (f: string) => void;
  highlightedLines?: Record<number, string>;
}

export default function CodeEditor({ code, language, filename, onCodeChange, onLanguageChange, onFilenameChange, highlightedLines = {} }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function loadSample(lang: Language) {
    const sample = SAMPLE_CODES[lang];
    if (sample) {
      onCodeChange(sample.code);
      onFilenameChange(sample.filename);
      onLanguageChange(lang as Language);
    }
  }

  function handleTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onCodeChange(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
  }

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full terminal overflow-hidden">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-line/60 bg-raised/60 shrink-0">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose/70" />
            <div className="w-3 h-3 rounded-full bg-amber/70" />
            <div className="w-3 h-3 rounded-full bg-lime/70" />
          </div>
          {/* Filename */}
          <div className="flex items-center gap-1.5 text-dim">
            <FileCode size={12} />
            <input
              value={filename}
              onChange={e => onFilenameChange(e.target.value)}
              className="bg-transparent text-xs font-mono text-soft focus:text-text focus:outline-none w-40"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative">
            <select
              value={language}
              onChange={e => onLanguageChange(e.target.value as Language)}
              className="appearance-none pl-2.5 pr-7 py-1 rounded-md bg-overlay border border-line text-xs font-mono text-soft focus:outline-none focus:border-cyan/40 cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{LANG_ICONS[l]} {l}</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
          </div>

          {/* Load sample */}
          <button
            onClick={() => loadSample(language)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan/10 border border-cyan/20 text-cyan text-xs hover:bg-cyan/20 transition-all"
          >
            <FlaskConical size={11} />
            Load Sample
          </button>
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Line numbers */}
        <div className="select-none text-right pr-3 pl-4 py-4 text-xs font-mono text-muted leading-6 bg-ink/40 border-r border-line/40 overflow-hidden shrink-0" style={{ minWidth: '3.5rem' }}>
          {lines.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-6',
                highlightedLines[i + 1] === 'critical' && 'text-rose',
                highlightedLines[i + 1] === 'warning' && 'text-amber',
                highlightedLines[i + 1] === 'suggestion' && 'text-cyan',
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => onCodeChange(e.target.value)}
            onKeyDown={handleTab}
            spellCheck={false}
            placeholder="// Paste your code here or click 'Load Sample'..."
            className="absolute inset-0 w-full h-full resize-none bg-transparent text-xs font-mono text-text leading-6 py-4 px-4 focus:outline-none placeholder-muted caret-cyan"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-raised/40 border-t border-line/40 shrink-0">
        <span className="text-xs font-mono text-muted">
          {lines.length} lines · {code.length} chars
        </span>
        <span className="text-xs font-mono text-muted">
          UTF-8 · {language.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
