import { prisma } from "@/lib/prisma/prisma";
import { Prisma, TransitionType } from "../../../../generated/prisma";


// NOTE: updatable fields may be subject to change based on requirements
export type UpdateBeatTransitionInput = {
    transitionType?: TransitionType;
    
    conditionDescription?: string;
    conditionJson?: Prisma.NullableJsonNullValueInput;

    isHidden?: boolean;
}

export async function updateBeatTransition(
    id: string,
    data: UpdateBeatTransitionInput
) {
    return prisma.beatTransition.update({
        where: { id },
        data,
    });
}