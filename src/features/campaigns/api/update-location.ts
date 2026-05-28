import { prisma } from "@/lib/prisma/prisma";

export type UpdateLocationInput = {
    name?: string,
    locationType?: string,
    description?: string,
    climate?: string,
    governmentType?: string
};

export async function updateLocation(
    id: string,
    data: UpdateLocationInput
) {
    return prisma.location.update({
        where: {
            id,
        },
        data,
    });
}