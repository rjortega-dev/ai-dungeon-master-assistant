import { prisma } from "@/lib/prisma/prisma";

export async function getCampaignLocation(campaignId: string) {
    return prisma.campaignLocation.findMany({
        where: {
            campaignId,
        },
        include: {
            location: true,
        },
    });
}