import { z } from "zod";

export const PlayerCharacterSchema = z.object({
  playerName: z.string(),
  characterName: z.string(),
  characterClass: z.string(),
  characterRace: z.string(),
  characterLevel: z.number().int().positive().default(0),
  notes: z.string(),

  age: z.string().optional(),             //string not int (players often say "mid-30s")
  gender: z.string().optional(),
  appearance: z.string().optional(),
  alignment: z.string().optional(),       //e.g. "Chaotic Good"
  backstory: z.string().optional(),
  motivation: z.string().optional(),
  goals: z.string().optional(),
  secrets: z.string().optional(),
  fears: z.string().optional(),
  
  isNpc: z.boolean().default(false)
});

export const LocationSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const WorldSettingSchema = z.object({
  name: z.string(),
  settingStyle: z.string(),
  locations: z.array(LocationSchema),
});

export const StoryBeatSchema = z.object({
  title: z.string(),

  storyBeatType: z.enum([
    "Main Story",
    "Side Story",
  ]),

  beatTaskType: z.enum([
    "Combat Encounter",
    "Meet New Character",
    "Find Item",
    "Exploration",
    "Puzzle",
    "Social Encounter",
    "Boss Fight",
    "Travel",
    "Other",
  ]),

  notes: z.string(),
});

export const CampaignPromptInputSchema = z.object({

    campaignName: z.string().default(""),

    worldSetting: WorldSettingSchema.default({
      name: "",
      settingStyle: "",
      locations: [],
    }),

    players: z
        .array(PlayerCharacterSchema).default([])
        ,

    storyBeats: z
        .array(StoryBeatSchema).default([])
        ,

    edition: z.string().default(""),

    isHomebrew: z.boolean().default(false),

    startingLevel: z.number().int().optional(),
    endingLevel: z.number().int().optional(),

    genre: z.string().default(""),
    tone: z.string().default(""),

    primaryThemes: z.string().default(""),

    inspiration: z.string().default(""),

    centralConflict: z.string().default(""),
    ultimateGoal: z.string().default(""),
});

export type PlayerCharacter = z.infer<
  typeof PlayerCharacterSchema
>;

export type Location = z.infer<
  typeof LocationSchema
>;

export type WorldSetting = z.infer<
  typeof WorldSettingSchema
>;

export type StoryBeat = z.infer<
  typeof StoryBeatSchema
>;

export type CampaignPromptInput = z.infer<
  typeof CampaignPromptInputSchema
>;