import generateStructuredOutput from "@/lib/openai/generate-structured-output";
import { LocationSchema } from "./generation-schemas";

export async function generateLocation(instructions:string, prompt: string) {
    const res = await generateStructuredOutput({
        formatSchema: LocationSchema,
        instructions: instructions,
        prompt: prompt,
    });
    return LocationSchema.parse(res)
}