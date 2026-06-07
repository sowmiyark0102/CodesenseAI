import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, code, language, filename, chatHistory, question, reviewContext } = req.body;

  try {
    // ── ACTION: Full Code Review ──────────────────────────────────────────────
    if (action === 'review') {
      const prompt = `You are a Staff Engineer at Google/Meta with 15 years of experience doing code reviews. Analyze this ${language} code with extreme thoroughness.

Filename: ${filename}
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON (no markdown, no backticks):
{
  "overallScore": <0-100 integer>,
  "summary": "<2-3 sentence executive summary of code quality>",
  "seniorEngineerVerdict": "<one punchy sentence a senior engineer would say in a real review, e.g. 'This is not production-ready — I count 3 SQL injection vectors and a hardcoded secret.'>",
  "complexityScore": <0-100>,
  "securityScore": <0-100>,
  "performanceScore": <0-100>,
  "maintainabilityScore": <0-100>,
  "estimatedBugProbability": <0-100, probability of bugs in production>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "issues": [
    {
      "id": "issue_1",
      "line": <line number>,
      "endLine": <optional end line>,
      "severity": "<critical|warning|suggestion|good>",
      "category": "<security|performance|maintainability|bug|style|best-practice>",
      "title": "<short title>",
      "description": "<detailed explanation of the problem>",
      "fix": "<specific code or action to fix this>",
      "impact": "<what goes wrong if not fixed>",
      "effort": "<low|medium|high>"
    }
  ],
  "refactoredCode": "<the complete refactored/improved version of the code with all issues fixed>"
}

Be extremely specific. Detect real bugs, security holes (SQL injection, XSS, hardcoded secrets, command injection), N+1 queries, memory leaks, type safety issues, error handling gaps, and OWASP Top 10 violations. For each issue, give the exact line number.`;

      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);
      return res.status(200).json(result);
    }

    // ── ACTION: Chat with AI about code ──────────────────────────────────────
    if (action === 'chat') {
      const systemPrompt = `You are a Staff Engineer at Google doing a code review. You have already reviewed this code:

\`\`\`${reviewContext?.language || 'code'}
${reviewContext?.code || 'No code provided'}
\`\`\`

Your review found these issues: ${JSON.stringify(reviewContext?.issues?.map((i: { title: string; severity: string }) => ({ title: i.title, severity: i.severity })) || [])}

Answer questions about this code concisely and helpfully. Use code examples when useful. Format with markdown.`;

      const messages = [
        ...(chatHistory || []),
        { role: 'user', content: question },
      ];

      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      });

      const answer = msg.content[0].type === 'text' ? msg.content[0].text : '';
      return res.status(200).json({ answer });
    }

    // ── ACTION: Generate test cases ───────────────────────────────────────────
    if (action === 'generate_tests') {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `Generate comprehensive unit tests for this ${language} code. Include edge cases, happy paths, and error scenarios.

\`\`\`${language}
${code}
\`\`\`

Return only the test code with comments. Use the most appropriate test framework for ${language}.`,
        }],
      });

      const tests = msg.content[0].type === 'text' ? msg.content[0].text : '';
      return res.status(200).json({ tests });
    }

    // ── ACTION: Explain code ───────────────────────────────────────────────────
    if (action === 'explain') {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Explain this ${language} code like you're onboarding a mid-level engineer. Be clear about what it does, how it works, and any patterns used. Keep it under 200 words.

\`\`\`${language}
${code}
\`\`\``,
        }],
      });

      const explanation = msg.content[0].type === 'text' ? msg.content[0].text : '';
      return res.status(200).json({ explanation });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('AI API error:', err);
    return res.status(500).json({ error: 'AI service error. Ensure ANTHROPIC_API_KEY is set in .env.local' });
  }
}
