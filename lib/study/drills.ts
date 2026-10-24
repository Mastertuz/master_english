import type { Drill } from "./types";
import {
  CONDITIONAL_DRILL,
  INVERSION_DRILL,
  MODALS_DRILL,
  PATTERN_DRILL,
  PERFECT_DRILL,
  WISH_DRILL,
} from "./drills-1";
import {
  CLEFT_DRILL,
  COMPARISON_DRILL,
  CONTINUOUS_DRILL,
  NARRATIVE_DRILL,
  NOUN_HAVE_DRILL,
  RELATIVE_DRILL,
} from "./drills-2";
import {
  LINKING_DRILL,
  PHRASAL_DRILL,
  PREPOSITION_DRILL,
  REFLEXIVE_DRILL,
  REGRET_DRILL,
  WORD_DRILL,
} from "./drills-3";

/** Порядок: сначала ваши ошибки из теста, затем грамматика юнитов Empower по порядку */
export const DRILLS: Drill[] = [
  WISH_DRILL,
  INVERSION_DRILL,
  CONDITIONAL_DRILL,
  MODALS_DRILL,
  PATTERN_DRILL,
  PREPOSITION_DRILL,
  PHRASAL_DRILL,
  WORD_DRILL,
  PERFECT_DRILL,
  COMPARISON_DRILL,
  NARRATIVE_DRILL,
  NOUN_HAVE_DRILL,
  RELATIVE_DRILL,
  CONTINUOUS_DRILL,
  CLEFT_DRILL,
  REFLEXIVE_DRILL,
  REGRET_DRILL,
  LINKING_DRILL,
];

export function drillById(id: string): Drill | undefined {
  return DRILLS.find((drill) => drill.id === id);
}

/** Пять групп: «ваши ошибки» и юниты */
export const DRILL_GROUPS: { title: string; text: string; ids: string[] }[] = [
  {
    title: "Ваши ошибки в тесте B2–C1",
    text: "Темы, в которых вы ошиблись: сначала закройте их.",
    ids: ["wish-rather", "inversion", "conditionals", "modals-past", "verb-patterns", "prepositions", "phrasal-idioms", "word-choice"],
  },
  {
    title: "Грамматика Empower C1",
    text: "По порядку юнитов: на неделях юнита делайте соответствующие упражнения.",
    ids: [
      "perfect-aspect",
      "comparison",
      "narrative",
      "noun-have-get",
      "relative-obligation",
      "continuous-participle",
      "cleft",
      "reflexive-ellipsis",
      "regret-passive",
      "linking",
    ],
  },
];
