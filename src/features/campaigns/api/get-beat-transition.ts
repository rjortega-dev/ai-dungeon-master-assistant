// src/features/beat-transitions/api/get-beat-transition.ts

import { prisma } from "@/lib/prisma/prisma";

export async function getBeatTransition(id: string) {
  return prisma.beatTransition.findUnique({
    where: {
      id,
    },

    include: {
      campaign: true,

      fromBeat: true,
      toBeat: true,
    },
  });
}