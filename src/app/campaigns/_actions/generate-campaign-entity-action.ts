import generateEntity from "@/features/campaigns/generation/generate-entity";
import { z } from 'zod';

export async function GenerateCampaignEntity (prompt: string, instructions: string, entitySchema: z.ZodObject){
    const res = await generateEntity(entitySchema, instructions, prompt)
    return res
}