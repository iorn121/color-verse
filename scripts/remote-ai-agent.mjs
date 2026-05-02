/**
 * GitHub Actions 用: Issue 本文からプロンプトを読み、@cursor/sdk のローカルエージェントを 1 回実行する。
 * 事前に agent-prompt.txt（または AGENT_PROMPT_FILE）を用意し、CURSOR_API_KEY を渡す。
 *
 * Agent.prompt だと長時間無出力になりやすいため、send + stream でログを出す。
 * AGENT_TIMEOUT_MS（既定 30 分）で打ち切り、可能なら run.cancel() する。
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

const timeoutMs = Number(process.env.AGENT_TIMEOUT_MS ?? 30 * 60 * 1000);
if (!Number.isFinite(timeoutMs) || timeoutMs < 1) {
  console.error('AGENT_TIMEOUT_MS must be a positive number.');
  process.exit(1);
}

/**
 * @param {import('@cursor/sdk').Run} run
 */
async function streamRunToStdout(run) {
  for await (const event of run.stream()) {
    switch (event.type) {
      case 'assistant':
        for (const block of event.message.content) {
          if (block.type === 'text') {
            process.stdout.write(block.text);
          } else if (block.type === 'tool_use') {
            process.stderr.write(`\n[tool] ${block.name}\n`);
          }
        }
        break;
      case 'status':
        process.stderr.write(`\n[status] ${event.status}${event.message ? ` ${event.message}` : ''}\n`);
        break;
      case 'thinking':
        process.stderr.write('.');
        break;
      case 'tool_call':
        process.stderr.write(`\n[tool_call] ${event.name} (${event.status})\n`);
        break;
      default:
        break;
    }
  }
}

/**
 * @param {import('@cursor/sdk').Run} run
 */
async function runWithTimeout(run) {
  const work = (async () => {
    await streamRunToStdout(run);
    return await run.wait();
  })();

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Agent timed out after ${timeoutMs}ms (set AGENT_TIMEOUT_MS to adjust)`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([work, timeoutPromise]);
  } catch (e) {
    if (run.supports('cancel')) {
      process.stderr.write('\n[cancel] stopping agent run after error or timeout…\n');
      await run.cancel().catch(() => {});
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

try {
  console.error(`Agent starting (timeout ${timeoutMs}ms)…\n`);

  const agent = await Agent.create({
    apiKey,
    model: { id: 'composer-2' },
    local: { cwd: process.cwd(), settingSources: [] },
  });

  try {
    const run = await agent.send(userPrompt);
    const result = await runWithTimeout(run);

    if (result.status === 'error') {
      console.error('Agent run finished with status error.');
      process.exit(2);
    }

    console.error('\nAgent finished:', result.status);
    if (result.result) {
      const text = result.result;
      console.log(text.length > 4000 ? `${text.slice(0, 4000)}…` : text);
    }
  } finally {
    await agent[Symbol.asyncDispose]();
  }
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error('CursorAgentError:', err.message);
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
}
