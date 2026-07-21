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

  age?: string | null;
  gender?: string | null;
  appearance?: string | null;
  alignment?: string | null;
  backstory?: string | null;
  motivation?: string | null;
  goals?: string | null;
  secrets?: string | null;
  fears?: string | null;
};

export async function createCharacter(data: CreateCharacterInput) {
  return prisma.character.create({
    data,
  });
}
