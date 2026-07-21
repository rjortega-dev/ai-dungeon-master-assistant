// src/features/locations/api/create-location.ts

import { prisma } from "@/lib/prisma/prisma";
import { LocationStatus } from "../../../../generated/prisma";

type CreateLocationInput = {
  creatorUserId: string;

  name: string;
  locationType?: string | null;
  description?: string | null;

  climate?: string | null;
  governmentType?: string | null;

  status?: LocationStatus;
  importance?: string | null;
  secrets?: string | null;
  rumors?: string | null;
};

export async function createLocation(data: CreateLocationInput) {
  return prisma.location.create({
    data,
  });
}
