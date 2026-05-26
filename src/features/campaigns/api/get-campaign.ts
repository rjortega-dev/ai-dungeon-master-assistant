"use server";

import { prisma } from '@/lib/prisma/prisma'

export async function getCampaign(id: string){
    return prisma.campaign.findUnique({
        where: { id },
    });
}