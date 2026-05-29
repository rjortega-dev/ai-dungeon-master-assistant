import { prisma } from "@/lib/prisma/prisma";

// NOTE: no includes added yet
export async function getLocation(id:string) {
    return prisma.location.findUnique({
        where: { id },
    });
}