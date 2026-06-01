import { prisma } from "@/lib/prisma/prisma";

export type UpdateCampaignCharacterInput = {
    roleInCampaign?: string;
    startingLevel?: number;
    notes?: string;
}

export async function updateCampaignCharacter(
    id: string,
    data: UpdateCampaignCharacterInput
) {
    return prisma.campaignCharacter.update({
        where: { id },
        data,
    });
}