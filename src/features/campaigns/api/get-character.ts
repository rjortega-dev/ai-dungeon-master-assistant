// src/features/characters/api/get-character.ts

import { prisma } from "@/lib/prisma/prisma";

export async function getCharacter(id: string) {
  return prisma.character.findUnique({
    where: {
      id,
    },

    include: {
      creator: true,

      campaignCharacters: {
        include: {
          campaign: true,
        },
      },
    },
  });
}