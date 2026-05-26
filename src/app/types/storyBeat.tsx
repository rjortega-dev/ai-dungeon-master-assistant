export type StoryBeat = {
  title: string;

  importance:
    | "main_story"
    | "side_story";

  type:
    | "combat_encounter"
    | "meet_character"
    | "find_item"
    | "exploration"
    | "puzzle"
    | "social_encounter"
    | "boss_fight"
    | "travel"
    | "other";

  notes: string;
};