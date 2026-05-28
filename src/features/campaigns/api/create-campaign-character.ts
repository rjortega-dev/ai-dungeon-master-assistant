import { prisma } from "@/lib/prisma/prisma";

type CreateCampaignCharacterInput = {
    campaignId: string;
    
    characterId: string;
    roleInCampaign?: string;
    startingLevel?: number;
    notes?: string;
};

export async function createCampaignCharacter(
    data: CreateCampaignCharacterInput
) {
    return prisma.campaignCharacter.create({
        data,
    });
}
