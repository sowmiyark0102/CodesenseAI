export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'go' | 'rust';
export type Severity = 'critical' | 'warning' | 'suggestion' | 'good';

export interface ReviewIssue {
  id: string;
  line: number;
  endLine?: number;
  severity: Severity;
  category: 'security' | 'performance' | 'maintainability' | 'bug' | 'style' | 'best-practice';
  title: string;
  description: string;
  fix?: string;
  codeSnippet?: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface ReviewResult {
  id: string;
  timestamp: Date;
  filename: string;
  language: Language;
  code: string;
  issues: ReviewIssue[];
  overallScore: number;
  summary: string;
  strengths: string[];
  refactoredCode?: string;
  complexityScore: number;
  securityScore: number;
  performanceScore: number;
  maintainabilityScore: number;
  estimatedBugProbability: number;
  seniorEngineerVerdict: string;
}

export interface HistoryItem {
  id: string;
  filename: string;
  language: Language;
  score: number;
  issueCount: number;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
