import { prisma } from "@/lib/prisma/prisma";

export type UpdateCampaignLocationInput = {
    notes?: string;
};

export async function updateCampaignLocation(
    id: string,
    data: UpdateCampaignLocationInput
) {
    return prisma.campaignLocation.update({
        where: { id },
        data,
    });
}