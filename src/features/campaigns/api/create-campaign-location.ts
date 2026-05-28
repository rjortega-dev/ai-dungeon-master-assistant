import { prisma } from "@/lib/prisma/prisma";

type CreateCampaignLocationInput = {
    campaignId: string;

    locationId: string;
    notes?: string;
};

export async function createCampaignLocation(
    data: CreateCampaignLocationInput
) {
    return prisma.campaignLocation.create({
        data,
    });
}