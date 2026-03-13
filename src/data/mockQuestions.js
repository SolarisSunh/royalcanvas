import { QUESTION_TYPES } from '../constants/questionTypes';

export const MOCK_QUESTIONS = [
  {
    id: 'q1',
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    stem: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
  },
  {
    id: 'q2',
    type: QUESTION_TYPES.TRUE_FALSE,
    stem: 'The sum of angles in a triangle is 180°.',
    options: ['True', 'False'],
    correctAnswer: 'True',
  },
  {
    id: 'q3',
    type: QUESTION_TYPES.MULTI_SELECT,
    stem: 'Select all prime numbers.',
    options: ['2', '3', '4', '5', '6'],
    correctAnswer: ['2', '3', '5'],
  },
  {
    id: 'q4',
    type: QUESTION_TYPES.SHORT_TEXT,
    stem: 'Solve for x: 2x + 4 = 10',
    placeholder: 'Enter your answer',
  },
  {
    id: 'q5',
    type: QUESTION_TYPES.LONG_TEXT,
    stem: 'Explain the fundamental theorem of calculus in your own words.',
    placeholder: 'Your explanation...',
  },
  {
    id: 'q6',
    type: QUESTION_TYPES.MATCHING,
    stem: 'Match the function to its derivative.',
    leftItems: ['x²', 'sin(x)', 'e^x'],
    rightItems: ['cos(x)', '2x', 'e^x'],
    correctPairs: { 'x²': '2x', 'sin(x)': 'cos(x)', 'e^x': 'e^x' },
  },
  {
    id: 'q7',
    type: QUESTION_TYPES.ORDERING,
    stem: 'Order the steps to solve a quadratic equation.',
    items: ['Apply the quadratic formula', 'Identify a, b, c', 'Simplify'],
    correctOrder: ['Identify a, b, c', 'Apply the quadratic formula', 'Simplify'],
  },
  {
    id: 'q8',
    type: QUESTION_TYPES.FILL_BLANK,
    stem: 'The derivative of sin(x) is ______.',
    blankPosition: 0,
    correctAnswer: 'cos(x)',
  },
  {
    id: 'q9',
    type: QUESTION_TYPES.FILE_UPLOAD,
    stem: 'Upload your worked solution as a PDF or image.',
    acceptedTypes: ['application/pdf', 'image/*'],
  },
  {
    id: 'q10',
    type: QUESTION_TYPES.OPEN_RESPONSE,
    stem: 'Describe how you would approach solving a real-world optimization problem.',
    placeholder: 'Your response...',
  },
];
