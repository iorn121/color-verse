import type { JisColor } from '../lib/jisColors';

export type QuizMode = 'name-to-color' | 'color-to-name';

export type QuizQuestion = {
  mode: QuizMode;
  correct: JisColor;
  options: JisColor[];
};

type RandomSource = {
  int: (maxExclusive: number) => number;
};

/** 慣用色の4択。正解の判定もこの出題が持つ。 */
export class ColorQuizRound {
  private constructor(readonly question: QuizQuestion) {}

  static deal(colors: readonly JisColor[], mode: QuizMode, random: RandomSource): ColorQuizRound | null {
    if (colors.length < 4) return null;
    const correct = colors[random.int(colors.length)];
    const pool = colors.filter((color) => color.hex !== correct.hex || color.name !== correct.name);
    const distractors: JisColor[] = [];
    const remaining = pool.slice();
    while (remaining.length > 0 && distractors.length < 3) {
      const index = random.int(remaining.length);
      distractors.push(remaining[index]);
      remaining.splice(index, 1);
    }
    if (distractors.length < 3) return null;
    const options = [...distractors, correct];
    for (let i = options.length - 1; i > 0; i -= 1) {
      const j = random.int(i + 1);
      [options[i], options[j]] = [options[j], options[i]];
    }
    return new ColorQuizRound({ mode, correct, options });
  }

  static grade(question: QuizQuestion, hex: string, name: string): boolean {
    return hex === question.correct.hex && name === question.correct.name;
  }

  grade(hex: string, name: string): boolean {
    return ColorQuizRound.grade(this.question, hex, name);
  }
}
