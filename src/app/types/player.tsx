export type Player = {
  playerName: string;
  characterName: string;
  characterClass: string;
  characterRace: string;
  characterLevel: number | null;
  notes: string;

  age?: string;              //string not int (players often say "mid-30s")
  gender?: string;
  appearance?: string;
  alignment?: string;       // e.g. "Chaotic Good"
  backstory?: string;
  motivation?: string;
  goals?: string;
  secrets?: string;
  fears?: string;

  isNpc: boolean;
};