// src/features/beat-transitions/api/create-beat-transition.ts

import { prisma } from "@/lib/prisma/prisma";
import { Prisma, TransitionType } from "../../../../generated/prisma";

type CreateBeatTransitionInput = {
  campaignId: string;

  fromBeatId: string;
  toBeatId: string;

  transitionType: TransitionType;

  conditionDescription?: string;
  conditionJson?: Prisma.NullableJsonNullValueInput;

  isHidden?: boolean;
};

export async function createBeatTransition(
  data: CreateBeatTransitionInput
) {
  return prisma.beatTransition.create({
    data,
  });
}