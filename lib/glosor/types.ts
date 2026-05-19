export type Glosa = {
  english: string;
  swedish: string;
  example?: string;
  notes?: string;
  practice_count: number;
  correct_count: number;
  incorrect_count: number;
};

export type WordGradeResult = {
  is_correct: boolean;
  corrected_swedish: string;
  explanation: string;
  word_explanation: string;
};
