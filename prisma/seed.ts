import { PrismaClient, CampaignStatus, BeatType, TransitionType } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg"
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({adapter});

async function main() {
  console.log("🌱 Starting seed...");

  // ======================================================
  // USERS
  // ======================================================

  const dmUser = await prisma.user.create({
    data: {
      email: "dm@merlin.dev",
      username: "DungeonMaster",
      passwordHash: "hashed-password-placeholder",
    },
  });

  const playerUser = await prisma.user.create({
    data: {
      email: "player@merlin.dev",
      username: "HeroPlayer",
      passwordHash: "hashed-password-placeholder",
    },
  });

  // ======================================================
  // CAMPAIGN
  // ======================================================

  const campaign = await prisma.campaign.create({
    data: {
      ownerUserId: dmUser.id,

      title: "The Shattered Crown",
      description:
        "A dark fantasy campaign involving political intrigue and ancient magic.",

      gameSystem: "Dungeons & Dragons 5e",

      settingSummary:
        "The kingdom of Valeris is collapsing after the disappearance of the royal bloodline.",

      status: CampaignStatus.ACTIVE,
    },
  });

  // ======================================================
  // ACTIVE CAMPAIGN
  // ======================================================

  const activeCampaign = await prisma.activeCampaign.create({
    data: {
      campaignID: campaign.id,
      dmUser: dmUser.id,
    },
  });

  // ======================================================
  // CHARACTERS
  // ======================================================

  const playerCharacter = await prisma.character.create({
    data: {
      creatorUserId: playerUser.id,

      name: "Kael Thornblade",
      race: "Half-Elf",
      class: "Ranger",
      background: "Outlander",

      description:
        "A wandering tracker searching for the truth behind his village's destruction.",

      isNpc: false,
    },
  });

  const npcCharacter = await prisma.character.create({
    data: {
      creatorUserId: dmUser.id,

      name: "Lady Seraphine",
      race: "Human",
      class: "Mage",

      description:
        "A royal advisor secretly studying forbidden arcane rituals.",

      isNpc: true,
    },
  });

  // ======================================================
  // CAMPAIGN CHARACTERS
  // ======================================================

  await prisma.campaignCharacter.createMany({
    data: [
      {
        campaignId: campaign.id,
        characterId: playerCharacter.id,

        roleInCampaign: "Main Player Character",
        startingLevel: 3,

        notes: "Strong ties to northern tribes.",

        inventory: {
          gold: 150,
          items: ["Longbow", "Iron Dagger", "Healing Potion"],
        },
      },

      {
        campaignId: campaign.id,
        characterId: npcCharacter.id,

        roleInCampaign: "Political Ally",
        startingLevel: 8,

        notes: "Potential secret antagonist.",

        inventory: {
          artifacts: ["Crystal Focus"],
        },
      },
    ],
  });

  // ======================================================
  // LOCATIONS
  // ======================================================

  const capitalCity = await prisma.location.create({
    data: {
      creatorUserId: dmUser.id,

      name: "Ebonreach",
      locationType: "Capital City",

      description:
        "A sprawling gothic capital ruled by fractured noble houses.",

      climate: "Cold Temperate",
      governmentType: "Monarchy",
    },
  });

  const ancientRuins = await prisma.location.create({
    data: {
      creatorUserId: dmUser.id,

      name: "Ashen Vault",

      locationType: "Dungeon",

      description:
        "Ancient underground ruins containing forbidden relics.",

      climate: "Dry Underground",
      governmentType: "None",
    },
  });

  // ======================================================
  // CAMPAIGN LOCATIONS
  // ======================================================

  await prisma.campaignLocation.createMany({
    data: [
      {
        campaignId: campaign.id,
        locationId: capitalCity.id,

        notes: "Primary political hub.",
      },

      {
        campaignId: campaign.id,
        locationId: ancientRuins.id,

        notes: "Late-game dungeon area.",
      },
    ],
  });

  // ======================================================
  // STORY BEATS
  // ======================================================

  const introBeat = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,

      title: "Arrival in Ebonreach",

      description:
        "The party arrives in the capital during a political uprising.",

      beatType: BeatType.MAIN_QUEST,

      sequenceOrder: 1,

      metadata: {
        difficulty: "easy",
      },
    },
  });

  const investigationBeat = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,

      title: "Investigate the Missing Heir",

      description:
        "Clues point toward an ancient conspiracy involving the royal bloodline.",

      beatType: BeatType.DIALOGUE,

      sequenceOrder: 2,
    },
  });

  const dungeonBeat = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,

      title: "Explore the Ashen Vault",

      description:
        "The party descends into ancient ruins searching for a magical artifact.",

      beatType: BeatType.BOSS,

      sequenceOrder: 3,
    },
  });

  // ======================================================
  // BEAT TRANSITIONS
  // ======================================================

  await prisma.beatTransition.createMany({
    data: [
      {
        campaignId: activeCampaign.id,

        fromBeatId: introBeat.id,
        toBeatId: investigationBeat.id,

        transitionType: TransitionType.SUCCESS,

        conditionDescription:
          "Players successfully gain audience with the council.",

        isHidden: false,
      },

      {
        campaignId: activeCampaign.id,

        fromBeatId: investigationBeat.id,
        toBeatId: dungeonBeat.id,

        transitionType: TransitionType.SECRET,

        conditionDescription:
          "Players uncover hidden documents exposing the vault location.",

        isHidden: true,
      },
    ],
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });