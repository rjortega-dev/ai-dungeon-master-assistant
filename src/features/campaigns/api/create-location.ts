// src/features/locations/api/create-location.ts

import { prisma } from "@/lib/prisma/prisma";

type CreateLocationInput = {
  creatorUserId: string;

  name: string;
  locationType?: string;
  description?: string;

  climate?: string;
  governmentType?: string;
};

export async function createLocation(
  data: CreateLocationInput
) {
  return prisma.location.create({
    data,
  });
}