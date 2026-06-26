import { z } from "zod";
import generateStructuredOutput from "@/lib/openai/generate-structured-output";

export default async function generateEntity<EntityTypeSchema extends z.ZodObject>(
    entitySchema: EntityTypeSchema,
    instructions: string,
    prompt: string ){
        const res = await generateStructuredOutput({
                formatSchema: entitySchema,
                instructions: instructions,
                prompt: prompt,
            });
            return res
    } 