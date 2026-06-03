"use server"
import { generateCampaign } from "@/features/campaigns/generation/generate-campaign";
import { CampaignPromptInput } from "@/features/campaigns/generation/input-schemas";

export async function GenerateCampaign(data: CampaignPromptInput){
    const res = await generateCampaign(data)

    return res
} 