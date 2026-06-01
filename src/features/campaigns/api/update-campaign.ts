import { prisma } from "@/lib/prisma/prisma";
import { CampaignStatus } from "../../../../generated/prisma";

// NOTE: made these fields updateable but subject to change if conflicts with AI generation
// Local type for updates only
export type UpdateCampaignInput = {
    title?: string,
    description?: string,
    gameSystem?: string,
    settingSummary?: string,
    status?: CampaignStatus
};

export async function updateCampaign(
    id: string,
    data: UpdateCampaignInput
) {
    return prisma.campaign.update({
        where: {
            id,
        },
        data,
    });
}

