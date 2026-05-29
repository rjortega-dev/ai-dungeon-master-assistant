import { z } from "zod";

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

export const LocationSchema = z.object({
  name: z.string().min(1),

  locationType: z.string().optional(),

  description: z.string().optional(),

  climate: z.string().optional(),

  governmentType: z.string().optional(),
  
});


export const StoryBeatSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    
    beatType: BeatTypeSchema,

    location: LocationSchema.optional(),
    
    sequenceOrder: z.number().int().nonnegative(),
    
    metadata: z.record(z.string(), z.unknown()).optional(),
});
export const BeatTransitionSchema = z.object({
    fromSequence: z.number().int().nonnegative(),
    toSequence: z.number().int().nonnegative(),
    
    transitionType: TransitionTypeSchema,
    
    conditionDescription: z.string().optional(),
    
    isHidden: z.boolean().default(false),
});

export const GeneratedCampaignSchema = z.object({
    title: z.string().min(1),
    
    description: z.string(),
    
    gameSystem: z.string(),
    
    settingSummary: z.string(),
    
    storyBeats: z
    .array(StoryBeatSchema)
    .min(3),
    
    transitions: z.array(
        BeatTransitionSchema
    ),
});


export type LocationInput = z.infer<typeof LocationSchema>;
export type StoryBeatInput = z.infer<typeof StoryBeatSchema>;
export type BeatTransitionInput = z.infer<typeof BeatTransitionSchema>;
export type GeneratedCampaign = z.infer<typeof GeneratedCampaignSchema>;