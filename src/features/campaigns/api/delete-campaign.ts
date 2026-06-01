import { prisma } from "@/lib/prisma/prisma";

export async function deleteCampaign(
    id: string
) {
    return prisma.campaign.delete({
        where: {
            id,
        }
    });
}