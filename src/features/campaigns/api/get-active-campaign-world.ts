
import { prisma } from "@/lib/prisma/prisma";

export async function getCampaignWorld(
  campaignId: string
) {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },

    include: {
      owner: true,
      campaignCharacters: {
        include: {
          character: {
            include: {
              campaignCharacters: true,
              creator: {
                omit: {
                    passwordHash: true,
                    email: true,
                }
              },
            },
          },
        },
      },

      campaignLocations: {
        include: {
          location: true,
        },
      },

      storyBeats: {
        orderBy: {
          sequenceOrder: "asc",
        },

        include: {
          outgoingTransitions: true,
          incomingTransitions: true,
        },
      },

      activeCampaigns: {
        include: {
          dm: true,

          beatTransitions: {
            include: {
              fromBeat: true,
              toBeat: true,
            },
          },
        },
      },
    },
  });

  if (!campaign) {
    return null;
  }

  const players = campaign.campaignCharacters
    .filter(
      (campaignCharacter) =>
        !campaignCharacter.character.isNpc
    )
    .map(
      (campaignCharacter) =>
        campaignCharacter.character
    );

  const storyBeats = [campaign.storyBeats]

  const npcs = campaign.campaignCharacters
    .filter(
      (campaignCharacter) =>
        campaignCharacter.character.isNpc
    )
    .map(
      (campaignCharacter) =>
        campaignCharacter.character
    );

  const transitions =
    campaign.activeCampaigns.flatMap(
      (activeCampaign) =>
        activeCampaign.beatTransitions
    );

  return {
    ...campaign,
    storyBeats,
    players,
    npcs,
    transitions,
  };
}