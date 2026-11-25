/**
 * GitHub Actions 用: Issue 本文からプロンプトを読み、Claude Code を 1 回実行する。
 * 事前に agent-prompt.txt（または AGENT_PROMPT_FILE）を用意する。
 * 認証は claude login、CLAUDE_CODE_OAUTH_TOKEN、ANTHROPIC_API_KEY のいずれか。
 * AGENT_TIMEOUT_MS（既定 30 分）で打ち切る。
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const promptFile = process.env.AGENT_PROMPT_FILE ?? 'agent-prompt.txt';
let userPrompt;
try {
  userPrompt = readFileSync(promptFile, 'utf8');
} catch (error) {
  console.error(`Failed to read prompt file: ${promptFile}`, error);
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

const model = process.env.CLAUDE_MODEL?.trim() || 'sonnet';
const bin = resolveClaudeBin();

console.error(`Claude starting (timeout ${timeoutMs}ms, model ${model})…\n`);

const child = spawn(
  bin,
  [
    '-p',
    '--output-format',
    'stream-json',
    '--verbose',
    '--permission-mode',
    'bypassPermissions',
    '--dangerously-skip-permissions',
    '--model',
    model,
    '--setting-sources',
    'project',
  ],
  { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] },
);

let settled = false;
let resultText = '';
let lineBuffer = '';
const timer = setTimeout(() => {
  console.error(`\n[cancel] stopping Claude after ${timeoutMs}ms\n`);
  child.kill('SIGTERM');
}, timeoutMs);

child.stdout.on('data', (chunk) => {
  lineBuffer += String(chunk);
  const lines = lineBuffer.split('\n');
  lineBuffer = lines.pop() ?? '';
  for (const line of lines) takeLine(line);
});
child.stderr.on('data', (chunk) => process.stderr.write(chunk));
child.on('error', (error) => {
  if (error && error.code === 'ENOENT') {
    console.error('claude command was not found. Install Claude Code and put it on PATH.');
    finish(1);
    return;
  }
  console.error(error);
  finish(1);
});
child.on('close', (code) => {
  if (lineBuffer) takeLine(lineBuffer);
  if (settled) return;
  if (code !== 0) {
    console.error(`\nClaude exited ${code ?? 'null'}`);
    finish(code || 1);
    return;
  }
  const logFinal = process.env.AGENT_LOG_FINAL_RESULT !== 'false' && process.env.CI !== 'true';
  if (logFinal && resultText) {
    console.log(resultText.length > 4000 ? `${resultText.slice(0, 4000)}…` : resultText);
  }
  console.error('\nClaude finished.');
  finish(0);
});

child.stdin.write(userPrompt);
child.stdin.end();

/**
 * @param {string} line
 */
function takeLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('{')) return;
  let event;
  try {
    event = JSON.parse(trimmed);
  } catch {
    return;
  }
  if (event.type === 'assistant') {
    for (const block of event.message?.content ?? []) {
      if (block.type === 'text' && block.text) process.stdout.write(block.text);
      else if (block.type === 'tool_use' && block.name) process.stderr.write(`\n[tool] ${block.name}\n`);
    }
  } else if (event.type === 'result' && typeof event.result === 'string') {
    resultText = event.result;
    if (event.is_error === true || event.subtype === 'error') {
      console.error('\nClaude run finished with status error.');
      finish(2);
    }
  }
}

/**
 * @param {number} code
 */
function finish(code) {
  if (settled) return;
  settled = true;
  clearTimeout(timer);
  process.exit(code);
}

function resolveClaudeBin() {
  if (process.env.CLAUDE_BIN?.trim()) return process.env.CLAUDE_BIN.trim();
  for (const directory of (process.env.PATH ?? '').split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, 'claude');
    if (existsSync(candidate)) return candidate;
  }
  const home = process.env.HOME || os.homedir();
  for (const candidate of [path.join(home, '.local', 'bin', 'claude'), '/usr/local/bin/claude']) {
    if (existsSync(candidate)) return candidate;
  }
  return 'claude';
}
