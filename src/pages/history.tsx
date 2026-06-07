import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import ScoreRing, { getScoreColor } from '@/components/ui/ScoreRing';
import { HistoryItem } from '@/utils/types';
import { History, Trash2, AlertTriangle, Clock, FileCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LANG_ICONS: Record<string, string> = {
  javascript: '🟨', typescript: '🟦', python: '🐍',
  java: '☕', cpp: '⚙️', go: '🐹', rust: '🦀',
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('codesense_history');
    if (stored) setHistory(JSON.parse(stored));
    setMounted(true);
  }, []);

  function clearHistory() {
    if (!confirm('Clear all review history?')) return;
    localStorage.removeItem('codesense_history');
    setHistory([]);
  }

  if (!mounted) return null;

  const avgScore = history.length ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
  const chartData = history.slice(0, 10).reverse().map((h, i) => ({
    name: `#${i + 1}`,
    score: h.score,
    filename: h.filename,
  }));

  return (
    <>
      <Head><title>CodeSense AI — Review History</title></Head>
      <div className="scanline" />
      <div className="min-h-screen bg-ink" style={{ background: 'radial-gradient(ellipse at top right, #0d1220 0%, #07080c 60%)' }}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-5 pt-20 pb-12">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 stagger">
            <div>
              <h1 className="font-display text-3xl font-bold text-bright mb-1">Review History</h1>
              <p className="text-sm text-dim">{history.length} reviews · avg score {avgScore}/100</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose/8 border border-rose/20 text-rose text-xs hover:bg-rose/15 transition-all"
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="glass-1 rounded-2xl border border-line/50 p-16 text-center stagger">
              <History size={40} className="text-muted mx-auto mb-4" />
              <p className="font-display font-semibold text-text mb-2">No Reviews Yet</p>
              <p className="text-sm text-dim">Run your first code review to see history here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-5 stagger">
              {/* Trend chart */}
              <div className="md:col-span-2 glass-1 rounded-2xl border border-line/50 p-5">
                <h2 className="font-display font-semibold text-text mb-1 text-sm">Score Trend</h2>
                <p className="text-xs text-dim mb-4">Last {Math.min(10, history.length)} reviews</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: '#5a6a90', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#5a6a90', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#131720', border: '1px solid #1f2840', borderRadius: 8, fontSize: 11 }}
                      formatter={(v: number) => [`${v}/100`, 'Score']}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.filename || ''}
                    />
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getScoreColor(entry.score)} />
                    ))}
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={getScoreColor(entry.score)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                {[
                  { label: 'Total Reviews', value: history.length, color: '#00d4ff' },
                  { label: 'Average Score', value: `${avgScore}/100`, color: getScoreColor(avgScore) },
                  { label: 'Critical Reviews', value: history.filter(h => h.score < 40).length, color: '#fb7185' },
                  { label: 'Excellent Reviews', value: history.filter(h => h.score >= 85).length, color: '#a3e635' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="glass-1 rounded-xl border border-line/50 p-4">
                    <p className="text-xs text-dim mb-1">{label}</p>
                    <p className="text-2xl font-display font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* History list */}
              <div className="md:col-span-3 space-y-2">
                <h2 className="font-display font-semibold text-text text-sm mb-3">All Reviews</h2>
                {history.map((item, i) => (
                  <div key={item.id} className="glass-1 rounded-xl border border-line/50 p-4 flex items-center gap-4 lift">
                    <ScoreRing score={item.score} size={44} strokeWidth={3.5} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm">{LANG_ICONS[item.language] || '📄'}</span>
                        <span className="font-mono text-sm font-medium text-text truncate">{item.filename}</span>
                        <span className="pill" style={{ background: '#1f284030', color: '#8899bb', border: '1px solid #1f2840' }}>
                          {item.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dim">
                        <span className="flex items-center gap-1"><AlertTriangle size={10} /> {item.issueCount} issues</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {formatDistanceToNow(new Date(item.timestamp))} ago</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold font-mono" style={{ color: getScoreColor(item.score) }}>{item.score}/100</p>
                      <p className="text-xs text-dim">#{history.length - i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
