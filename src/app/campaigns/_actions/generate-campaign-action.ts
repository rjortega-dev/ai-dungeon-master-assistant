"use server"
import { generateCampaign } from "@/features/campaigns/generation/generate-campaign";
import { CampaignPromptInput } from "@/features/campaigns/generation/input-schemas";
import { json } from "stream/consumers";
import { ActiveCampaign } from "../../../../generated/prisma";
import { GeneratedCampaign } from "@/features/campaigns/generation/generation-schemas";

export async function GenerateCampaign(data: CampaignPromptInput){
    const dataString = JSON.stringify(data)
    const res = await generateCampaign(data)

    return res
} 