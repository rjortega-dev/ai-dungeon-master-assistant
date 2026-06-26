import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import { CAMPAIGN_INSTRUCTIONS, campaignPrompt } from "./prompts";
import { GeneratedCampaign, GeneratedCampaignSchema } from "./generation-schemas";
import { CampaignPromptInput } from "./input-schemas";


export async function generateCampaign(
    promptInput: CampaignPromptInput
) : Promise<GeneratedCampaign>{

    const prompt = campaignPrompt(promptInput)
    const instructions = CAMPAIGN_INSTRUCTIONS

    const response = await generateStructuredOutput({
        formatSchema: GeneratedCampaignSchema,
        instructions: instructions,
        prompt: prompt,
    });
    return GeneratedCampaignSchema.parse(response);
} 