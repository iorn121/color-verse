/**
 * GitHub Actions 用: Issue 本文からプロンプトを読み、@cursor/sdk のローカルエージェントを 1 回実行する。
 * 事前に agent-prompt.txt（または AGENT_PROMPT_FILE）を用意し、CURSOR_API_KEY を渡す。
 */
import { readFileSync } from 'node:fs';

import { Agent, CursorAgentError } from '@cursor/sdk';

const apiKey = process.env.CURSOR_API_KEY;
if (!apiKey?.trim()) {
  console.error('CURSOR_API_KEY is not set. Add the repository secret CURSOR_API_KEY.');
  process.exit(1);
}

const promptFile = process.env.AGENT_PROMPT_FILE ?? 'agent-prompt.txt';
let userPrompt;
try {
  userPrompt = readFileSync(promptFile, 'utf8');
} catch (e) {
  console.error(`Failed to read prompt file: ${promptFile}`, e);
  process.exit(1);
}

if (!userPrompt.trim()) {
  console.error('Agent prompt is empty.');
  process.exit(1);
}

try {
  const result = await Agent.prompt(userPrompt, {
    apiKey,
    model: { id: 'composer-2' },
    local: { cwd: process.cwd(), settingSources: [] },
  });

  if (result.status === 'error') {
    console.error('Agent run finished with status error.');
    process.exit(2);
  }

  console.log('Agent finished:', result.status);
  if (result.result) {
    const text = result.result;
    console.log(text.length > 4000 ? `${text.slice(0, 4000)}…` : text);
  }
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error('CursorAgentError:', err.message);
    process.exit(1);
  }
  throw err;
}
