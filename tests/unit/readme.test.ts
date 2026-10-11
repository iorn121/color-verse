import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const readmePath = join(process.cwd(), 'README.md');

function readReadme(): string {
  return readFileSync(readmePath, 'utf8');
}

function lastNonEmptyLine(content: string): string {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const trimmed = lines[i]?.trim();
    if (trimmed) return trimmed;
  }
  return '';
}

describe('README verification sentence (docs/specs/20261011-readme.md)', () => {
  it('ends with a single Japanese verification sentence (AC1)', () => {
    const last = lastNonEmptyLine(readReadme());
    expect(last).toMatch(/^動作確認:/);
    expect(last).toContain('npm run dev');
    expect(last).toContain('http://localhost:5173');
    expect(last.endsWith('。')).toBe(true);
    expect(last.split('。').filter(Boolean)).toHaveLength(1);
  });

  it('keeps the setup section and matches dev URL with the trailing sentence (AC4)', () => {
    const content = readReadme();
    const setupBlock = content.match(/### セットアップ[\s\S]*?```bash[\s\S]*?```/);
    expect(setupBlock).not.toBeNull();
    expect(setupBlock![0]).toContain('npm run dev');
    expect(setupBlock![0]).toContain('http://localhost:5173');

    const last = lastNonEmptyLine(content);
    expect(last).toContain('npm run dev');
    expect(last).toContain('http://localhost:5173');
  });

  it('retains major README sections without removing the backlog (AC2)', () => {
    const content = readReadme();
    expect(content).toContain('### セットアップ');
    expect(content).toContain('## 改善点バックログ');
    expect(content).toContain('### ライセンス');
  });
});
