export const quiz = [
  {image: require('../assets/quiz/StreetwearQuiz.png'), answer: 'Streetwear', options: ['Casual', 'Streetwear', 'Business', 'Formal']},
  {image: require('../assets/quiz/FormalQuiz.png'), answer: 'Formal', options: ['Bohemian', 'Streetwear', 'Athleisure', 'Formal']},
  {image: require('../assets/quiz/BusinessQuiz.png'), answer: 'Business', options: ['Streetwear', 'Old Money', 'Business', 'Preppy']},
  {image: require('../assets/quiz/CasualQuiz.png'), answer: 'Casual', options: ['Casual', 'Formal', 'Punk', 'Business']},
  {image: require('../assets/quiz/StreetwearQuizAlt.png'), answer: 'Streetwear', options: ['Classic', 'Casual', 'Streetwear', 'Formal']},
];

/** Seconds allowed per quiz question. */
export const QUIZ_SECONDS_PER_QUESTION = 15;

/** Total number of questions in a single quiz run. */
export const QUIZ_QUESTION_COUNT = quiz.length;
