// src/features/characters/api/create-character.ts

import { prisma } from "@/lib/prisma/prisma";

type CreateCharacterInput = {
  creatorUserId: string;

  name: string;
  race?: string;
  class?: string;
  background?: string;
  description?: string;

  isNpc?: boolean;
};

export async function createCharacter(
  data: CreateCharacterInput
) {
  return prisma.character.create({
    data,
  });
}