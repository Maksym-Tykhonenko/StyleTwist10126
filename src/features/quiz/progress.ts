import {QuizAttempt} from '../../store';
import {QUIZ_QUESTION_COUNT} from '../../data/quiz';

export type QuizLevel = {name: string; min: number};

/** XP = total correct answers. Tiers extend the titles used on the result screen. */
export const QUIZ_LEVELS: QuizLevel[] = [
  {name: 'Style Explorer', min: 0},
  {name: 'Style Apprentice', min: 15},
  {name: 'Style Authority', min: 40},
  {name: 'Style Icon', min: 80},
];

export type QuizProgress = {
  totalAttempts: number;
  xp: number;
  bestScorePct: number;
  averagePct: number;
  currentStreak: number;
  bestStreak: number;
  playedToday: boolean;
  level: QuizLevel;
  nextLevel: QuizLevel | null;
  /** 0..1 progress from the current level toward the next (1 when maxed). */
  levelProgress: number;
  xpToNextLevel: number;
};

/** Local calendar day index (days since epoch), so streaks respect midnight. */
const dayIndex = (iso: string) => {
  const date = new Date(iso);
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(midnight.getTime() / 86400000);
};

const toPercent = (score: number) => Math.round((score / QUIZ_QUESTION_COUNT) * 100);

const longestRun = (sortedDays: number[]) => {
  let best = 0;
  let run = 0;
  for (let i = 0; i < sortedDays.length; i += 1) {
    run = i > 0 && sortedDays[i] === sortedDays[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
};

export function computeQuizProgress(attempts: QuizAttempt[]): QuizProgress {
  const xp = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const bestScorePct = attempts.length ? toPercent(Math.max(...attempts.map(a => a.score))) : 0;
  const averagePct = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + toPercent(a.score), 0) / attempts.length)
    : 0;

  const uniqueDays = Array.from(new Set(attempts.map(a => dayIndex(a.date)))).sort((a, b) => a - b);
  const daySet = new Set(uniqueDays);
  const today = dayIndex(new Date().toISOString());
  const playedToday = daySet.has(today);

  let currentStreak = 0;
  let cursor = playedToday ? today : today - 1;
  while (daySet.has(cursor)) {
    currentStreak += 1;
    cursor -= 1;
  }
  const bestStreak = Math.max(longestRun(uniqueDays), currentStreak);

  let level = QUIZ_LEVELS[0];
  let nextLevel: QuizLevel | null = null;
  for (let i = 0; i < QUIZ_LEVELS.length; i += 1) {
    if (xp >= QUIZ_LEVELS[i].min) {
      level = QUIZ_LEVELS[i];
      nextLevel = QUIZ_LEVELS[i + 1] ?? null;
    }
  }

  const levelProgress = nextLevel
    ? Math.min(1, (xp - level.min) / (nextLevel.min - level.min))
    : 1;
  const xpToNextLevel = nextLevel ? Math.max(0, nextLevel.min - xp) : 0;

  return {
    totalAttempts: attempts.length,
    xp,
    bestScorePct,
    averagePct,
    currentStreak,
    bestStreak,
    playedToday,
    level,
    nextLevel,
    levelProgress,
    xpToNextLevel,
  };
}
