import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import { campaignInstructions, campaignPrompt } from "./prompts";
import { GeneratedCampaign, GeneratedCampaignSchema } from "./generation-schemas";
import { CampaignPromptInput } from "./input-schemas";


export async function generateCampaign(
    promptInput: CampaignPromptInput
) : Promise<GeneratedCampaign>{

    const prompt = campaignPrompt(promptInput)
    const instructions = campaignInstructions

    const response = await generateStructuredOutput({
        formatSchema: GeneratedCampaignSchema,
        instructions: instructions,
        prompt: prompt,
    });
    return GeneratedCampaignSchema.parse(response);
} 