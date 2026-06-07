import { useState } from 'react';
import { ReviewResult, ReviewIssue } from '@/utils/types';
import ScoreRing, { getScoreColor, getScoreLabel } from '@/components/ui/ScoreRing';
import IssueBadge from '@/components/ui/IssueBadge';
import {
  ShieldAlert, Zap, Wrench, Star, ChevronDown, ChevronRight,
  Copy, CheckCheck, Code2, AlertTriangle, TestTube, Brain
} from 'lucide-react';
import clsx from 'clsx';

interface Props {
  result: ReviewResult;
  onLineSelect: (line: number) => void;
  onShowRefactored: () => void;
  onGenerateTests: () => void;
  onChat: (q: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  security:        ShieldAlert,
  performance:     Zap,
  maintainability: Wrench,
  bug:             AlertTriangle,
  style:           Code2,
  'best-practice': Star,
};

function IssueCard({ issue, onLineSelect }: { issue: ReviewIssue; onLineSelect: (l: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const Icon = CATEGORY_ICONS[issue.category] || AlertTriangle;

  function copyFix() {
    if (issue.fix) { navigator.clipboard.writeText(issue.fix); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  return (
    <div className={clsx(
      'rounded-lg border transition-all duration-200',
      issue.severity === 'critical' ? 'border-rose/20 bg-rose/4' :
      issue.severity === 'warning'  ? 'border-amber/20 bg-amber/4' :
      issue.severity === 'good'     ? 'border-lime/20 bg-lime/4' :
      'border-line/50 bg-raised/30'
    )}>
      <button
        className="w-full flex items-start gap-3 p-3.5 text-left"
        onClick={() => { setExpanded(e => !e); onLineSelect(issue.line); }}
      >
        <div className={clsx(
          'w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5',
          issue.severity === 'critical' ? 'bg-rose/15' :
          issue.severity === 'warning'  ? 'bg-amber/15' :
          issue.severity === 'good'     ? 'bg-lime/15' :
          'bg-cyan/15'
        )}>
          <Icon size={13} className={
            issue.severity === 'critical' ? 'text-rose' :
            issue.severity === 'warning'  ? 'text-amber' :
            issue.severity === 'good'     ? 'text-lime' :
            'text-cyan'
          } />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <IssueBadge severity={issue.severity} />
            <span className="text-xs text-muted font-mono">L{issue.line}</span>
            <span className="text-xs text-dim capitalize">{issue.category}</span>
          </div>
          <p className="text-sm font-medium text-text leading-snug">{issue.title}</p>
        </div>
        {expanded ? <ChevronDown size={14} className="text-dim shrink-0 mt-1" /> : <ChevronRight size={14} className="text-dim shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 space-y-2.5 animate-slide-in">
          <p className="text-xs text-soft leading-relaxed">{issue.description}</p>

          <div className="flex gap-2">
            <span className="pill tag-warning">Impact: {issue.impact}</span>
            <span className={clsx('pill', issue.effort === 'low' ? 'tag-good' : issue.effort === 'medium' ? 'tag-warning' : 'tag-critical')}>
              Effort: {issue.effort}
            </span>
          </div>

          {issue.fix && (
            <div className="rounded-md bg-ink border border-line p-3 relative">
              <p className="text-xs text-muted mb-1.5 font-mono">// Fix</p>
              <pre className="text-xs text-lime font-mono leading-relaxed whitespace-pre-wrap break-words">{issue.fix}</pre>
              <button
                onClick={copyFix}
                className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-raised transition-colors text-muted hover:text-text"
              >
                {copied ? <CheckCheck size={12} className="text-lime" /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewPanel({ result, onLineSelect, onShowRefactored, onGenerateTests, onChat }: Props) {
  const [activeTab, setActiveTab] = useState<'issues' | 'scores' | 'strengths'>('issues');
  const [filter, setFilter] = useState<string>('all');

  const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
  const warningCount  = result.issues.filter(i => i.severity === 'warning').length;

  const filteredIssues = filter === 'all'
    ? result.issues
    : result.issues.filter(i => i.severity === filter || i.category === filter);

  const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'critical', label: `Critical (${criticalCount})` },
    { value: 'warning', label: `Warning (${warningCount})` },
    { value: 'security', label: 'Security' },
    { value: 'performance', label: 'Perf' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Overall score header */}
      <div className="p-5 border-b border-line/50 bg-raised/30 shrink-0">
        {/* Verdict */}
        <div className="rounded-lg border border-line/50 bg-ink p-3 mb-4 font-mono text-xs">
          <span className="text-muted">// Senior Engineer: </span>
          <span className="text-cyan">&quot;{result.seniorEngineerVerdict}&quot;</span>
        </div>

        {/* Score grid */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <ScoreRing score={result.overallScore} size={76} label="Overall" />
          <div className="flex gap-2 flex-wrap justify-end">
            <ScoreRing score={result.securityScore}       size={48} label="Security"    strokeWidth={4} />
            <ScoreRing score={result.performanceScore}    size={48} label="Perf"         strokeWidth={4} />
            <ScoreRing score={result.complexityScore}     size={48} label="Complexity"   strokeWidth={4} />
            <ScoreRing score={result.maintainabilityScore} size={48} label="Maintain"   strokeWidth={4} />
          </div>
        </div>

        {/* Bug probability */}
        <div className="rounded-md bg-rose/8 border border-rose/20 p-2.5 flex items-center justify-between">
          <span className="text-xs text-dim flex items-center gap-1.5">
            <AlertTriangle size={11} className="text-rose" /> Bug probability in production
          </span>
          <span className="text-sm font-mono font-semibold text-rose">{result.estimatedBugProbability}%</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onShowRefactored}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-lime/10 border border-lime/20 text-lime text-xs font-medium hover:bg-lime/20 transition-all"
          >
            <Code2 size={12} /> View Fixed Code
          </button>
          <button
            onClick={onGenerateTests}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet/10 border border-violet/20 text-violet text-xs font-medium hover:bg-violet/20 transition-all"
          >
            <TestTube size={12} /> Generate Tests
          </button>
          <button
            onClick={() => onChat('What is the most critical issue in this code?')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan text-xs font-medium hover:bg-cyan/20 transition-all"
          >
            <Brain size={12} /> Ask AI
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line/50 shrink-0">
        {(['issues', 'scores', 'strengths'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 py-2.5 text-xs font-medium capitalize transition-all',
              activeTab === tab ? 'text-cyan border-b-2 border-cyan' : 'text-dim hover:text-soft'
            )}
          >
            {tab} {tab === 'issues' && `(${result.issues.length})`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'issues' && (
          <div className="p-4 space-y-2">
            {/* Filter bar */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={clsx(
                    'px-2.5 py-1 rounded-md text-xs transition-all',
                    filter === f.value ? 'bg-cyan/15 text-cyan border border-cyan/30' : 'bg-raised text-dim border border-line hover:text-text'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {filteredIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} onLineSelect={onLineSelect} />
            ))}
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-dim leading-relaxed">{result.summary}</p>
            {[
              { label: 'Security', score: result.securityScore },
              { label: 'Performance', score: result.performanceScore },
              { label: 'Complexity', score: result.complexityScore },
              { label: 'Maintainability', score: result.maintainabilityScore },
            ].map(({ label, score }) => {
              const color = getScoreColor(score);
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-soft">{label}</span>
                    <span className="font-mono" style={{ color }}>{score}/100 — {getScoreLabel(score)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-raised overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}88` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'strengths' && (
          <div className="p-4 space-y-2">
            {result.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-lg bg-lime/6 border border-lime/15 p-3">
                <span className="text-lime mt-0.5">✓</span>
                <p className="text-xs text-soft leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
