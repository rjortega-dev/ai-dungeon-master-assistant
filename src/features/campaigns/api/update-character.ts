// src/features/characters/api/update-character.ts

import { prisma } from "@/lib/prisma/prisma";

type UpdateCharacterInput = {
  name?: string;
  race?: string;
  class?: string;
  background?: string;
  description?: string;
  isNpc?: boolean;
};

export async function updateCharacter(
  id: string,
  data: UpdateCharacterInput
) {
  return prisma.character.update({
    where: {
      id,
    },

    data,
  });
}