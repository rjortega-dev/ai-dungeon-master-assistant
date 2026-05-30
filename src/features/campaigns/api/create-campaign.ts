// src/features/campaigns/api/create-campaign.ts

import { prisma } from "@/lib/prisma/prisma";
import { CampaignStatus } from "../../../../generated/prisma";

//export local type for creation
export type CreateCampaignInput = {
  ownerUserId: string;
  title: string;
  description?: string;
  gameSystem?: string;
  settingSummary?: string;
  status?: CampaignStatus;
};

export async function createCampaign(
  data: CreateCampaignInput
) {
  return prisma.campaign.create({
    data,
  });
}