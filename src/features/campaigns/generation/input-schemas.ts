import { z } from "zod";

export const PlayerCharacterSchema = z.object({
  playerName: z.string(),
  characterName: z.string(),
  characterClass: z.string(),
  characterRace: z.string(),
  characterLevel: z.number().int().positive(),
  notes: z.string(),
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

    campaignName: z.string(),

    worldSetting: WorldSettingSchema,

    players: z
        .array(PlayerCharacterSchema)
        ,

    storyBeats: z
        .array(StoryBeatSchema)
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