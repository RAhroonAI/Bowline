export type Verb = {
  infinitive: string;
  presens: string;
  preteritum: string;
  supinum: string;
  perfekt_particip: string;
  practice_count: number;
  correct_count: number;
  incorrect_count: number;
};

export type TargetForm =
  | "infinitive"
  | "presens"
  | "preteritum"
  | "supinum"
  | "perfekt_particip";

export type RoundSeed = {
  target_form: TargetForm;
  english_sentence: string;
  expected_swedish: string;
};

export type GradeResult = {
  is_correct: boolean;
  corrected_swedish: string;
  explanation: string;
  verb_explanation: string;
};

export type ActiveRound = {
  verb: Verb;
  seed: RoundSeed;
  user_input?: string;
  grade?: GradeResult;
};
