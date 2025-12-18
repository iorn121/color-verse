import { useEffect, useMemo, useState } from 'react';

import type { JisColor } from '../lib/jisColors';
import { getRandomInt, pickRandom } from '../lib/jisColors';

export type QuizMode = 'name-to-color' | 'color-to-name';

export type QuizQuestion = {
  mode: QuizMode;
  correct: JisColor;
  options: JisColor[]; // 4択
};

function buildQuestion(colors: JisColor[], mode: QuizMode): QuizQuestion {
  const correct = colors[getRandomInt(colors.length)];
  const distractors = pickRandom(
    colors.filter((c) => c.hex !== correct.hex || c.name !== correct.name),
    3,
  );
  const options = [...distractors, correct];
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { mode, correct, options };
}

export function useColorQuiz(colors: JisColor[], mode: QuizMode) {
  const [turn, setTurn] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null); // hex|name

  // モード切替時は出題を更新し、選択状態をクリア
  useEffect(() => {
    setSelectedKey(null);
    setTurn((t) => t + 1);
  }, [mode]);

  const question = useMemo<QuizQuestion | null>(() => {
    // turn は再出題トリガーとして使用
    void turn;
    if (!colors || colors.length < 4) return null;
    return buildQuestion(colors, mode);
  }, [colors, mode, turn]);

  const isCorrect = useMemo<boolean | null>(() => {
    if (!question || !selectedKey) return null;
    const [hex, name] = selectedKey.split('|');
    return hex === question.correct.hex && name === question.correct.name;
  }, [question, selectedKey]);

  const handleAnswer = (opt: JisColor) => {
    if (!question || selectedKey) return;
    setSelectedKey(`${opt.hex}|${opt.name}`);
  };

  const next = () => {
    setSelectedKey(null);
    setTurn((t) => t + 1);
  };

  return {
    question,
    selectedKey,
    isCorrect,
    handleAnswer,
    next,
  };
}
