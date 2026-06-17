import { z } from "zod";

export const PlayerCharacterSchema = z.object({
  playerName: z.string(),
  characterName: z.string(),
  characterClass: z.string(),
  characterRace: z.string(),
  characterLevel: z.number().int().positive().default(0),
  notes: z.string(),
});

// TODO: locationType, climate, governmentType optional or required?
// TODO: add these three to form also?
export const LocationSchema = z.object({
  name: z.string(),
  locationType: z.string(),
  description: z.string(),

  climate: z.string(),
  governmentType: z.string(),

  status: z.enum(["SAFE", "DANGEROUS", "DESTROYED", "OCCUPIED", "UNKNOWN"]).default("UNKNOWN"),
  importance: z.string().optional(),
  secrets: z.string().optional(),
  rumors: z.string().optional(),
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