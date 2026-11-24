import { useEffect, useMemo, useState } from 'react';

import { ColorQuizRound, type QuizMode, type QuizQuestion } from '../domain/color-quiz';
import type { JisColor } from '../lib/jisColors';
import { getRandomInt } from '../lib/jisColors';

export type { QuizMode, QuizQuestion };

function buildQuestion(colors: JisColor[], mode: QuizMode): QuizQuestion {
  const round = ColorQuizRound.deal(colors, mode, { int: getRandomInt });
  if (!round) throw new Error('not enough colors');
  return round.question;
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
    return ColorQuizRound.grade(question, hex, name);
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
