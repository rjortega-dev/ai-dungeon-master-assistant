// src/features/story-beats/api/create-story-beat.ts

import { prisma } from "@/lib/prisma/prisma";
import { BeatType, Prisma } from "../../../../generated/prisma";

type CreateStoryBeatInput = {
  campaignId: string;

  title: string;
  description?: string;

  beatType: BeatType;

  sequenceOrder?: number;

  metadata?: Prisma.NullableJsonNullValueInput;
};

export async function createStoryBeat(
  data: CreateStoryBeatInput
) {
  return prisma.storyBeat.create({
    data,
  });
}