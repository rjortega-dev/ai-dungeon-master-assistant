import { z } from "zod";
import { PlayerCharacterSchema } from "./input-schemas";

// enums
export const CampaignStatusSchema = z.enum([
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "ARCHIVED",
]);

export const BeatTypeSchema = z.enum([
  "MAIN_QUEST",
  "SIDE_QUEST",
  "ENCOUNTER",
  "DIALOGUE",
  "BOSS",
  "ENDING",
]);

export const TransitionTypeSchema = z.enum([
  "SUCCESS",
  "FAILURE",
  "ACCEPT",
  "REJECT",
  "OPTIONAL",
  "SECRET",
  "COMBAT_WIN",
  "COMBAT_LOSS",
]);

export const GameSystems = z.enum([
  "DD5E",
  "PATHFINDER2E",
  "PBTA",
  "FATECORE",
  "SAVAGEWORLDS",
  "GURPS",
]);

export const GenericGenerationContext = z.object({
  notes: z.string().optional().nullable(),
  context: z.array(z.any()).optional().nullable()
});

// campaign entities
export const LocationSchema = z.object({
  name: z.string().min(1),

  locationType: z.string().optional().nullable(),

  description: z.string().optional().nullable(),

  climate: z.string().optional().nullable(),

  governmentType: z.string().optional().nullable(),
  
});

export const GeneratedCharacterSchema = z.object({
  name: z.string().min(1),
  race: z.string().min(1),
  class: z.string().min(1),
  background: z.string().min(1),
  description: z.string().min(1),
  isNpc: z.boolean(),
})

// Beats
export const StoryBeatSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    
    beatType: BeatTypeSchema,

    location: LocationSchema.optional().nullable(),
    
    sequenceOrder: z.number().int().nonnegative(),
});
export const BeatTransitionSchema = z.object({
    fromSequence: z.number().int().nonnegative(),
    toSequence: z.number().int().nonnegative(),
    
    transitionType: TransitionTypeSchema,
    
    conditionDescription: z.string().optional().nullable(),
    
    isHidden: z.boolean().default(false),
});

// campaign meta

export const GeneratedCampaignSchema = z.object({
    title: z.string().min(1),
    
    description: z.string(),
    
    gameSystem: z.string(),
    
    settingSummary: z.string(),
    
    storyBeats: z
    .array(StoryBeatSchema)
    .min(3),
    
    players: z.array(PlayerCharacterSchema),

    transitions: z.array(
        BeatTransitionSchema
    ),
});

export const SideStorySchema = z.object({
  storyBeats: z
    .array(StoryBeatSchema)
    .min(3).max(3),
  transitions: z.array(BeatTransitionSchema)
})

export const CampaignMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  gameSystem: GameSystems,
  settingSummary: z.string().min(1),
})

export const GeneratedTransitionsSchema = z.array(BeatTransitionSchema)

export type SideStory = z.infer<typeof SideStorySchema>;
export type GenerationContext = z.infer<typeof GenericGenerationContext>;
export type CampaignTransitions = z.infer<typeof GeneratedTransitionsSchema>;
export type CampaignMeta = z.infer<typeof CampaignMetaSchema>;
export type GeneratedCharacter = z.infer<typeof GeneratedCharacterSchema>;
export type GeneratedLocation = z.infer<typeof LocationSchema>;
export type StoryBeat = z.infer<typeof StoryBeatSchema>;
export type BeatTransitionInput = z.infer<typeof BeatTransitionSchema>;
export type GeneratedCampaign = z.infer<typeof GeneratedCampaignSchema>;