// src/features/characters/api/get-campaign-characters.ts

import { prisma } from "@/lib/prisma/prisma";

export async function getCampaignCharacters(
  campaignId: string
) {
  return prisma.campaignCharacter.findMany({
    where: {
      campaignId,
    },

    include: {
      character: true,
    },
  });
}