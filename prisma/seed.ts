import {
  PrismaClient,
  CampaignStatus,
  BeatType,
  TransitionType,
} from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ======================================================
  // USERS
  // ======================================================

  const dmUser = await prisma.user.upsert({
    where: { email: "dm@merlin.dev" },
    update: {},
    create: {
      email: "dm@merlin.dev",
      username: "DungeonMaster",
      passwordHash: "hashed-password-placeholder",
    },
  });

  const playerUser = await prisma.user.upsert({
    where: { email: "player@merlin.dev" },
    update: {},
    create: {
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
      description: "Ancient underground ruins containing forbidden relics.",
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
  // STORY BEATS (14 total: 8 main, 6 side)
  // ======================================================

  const beat1 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Arrival in Ebonreach",
      description:
        "The party arrives in the capital during a political uprising.",
      beatType: BeatType.MAIN_QUEST,
      sequenceOrder: 1,
      metadata: { difficulty: "easy" },
    },
  });

  const beat2 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Investigate the Missing Heir",
      description:
        "Clues point toward an ancient conspiracy involving the royal bloodline.",
      beatType: BeatType.DIALOGUE,
      sequenceOrder: 2,
    },
  });

  const beat3 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Meet the Thieves' Guild",
      description:
        "A shadowy contact offers a faster path to the vault — for a price.",
      beatType: BeatType.SIDE_QUEST,
      sequenceOrder: 3,
    },
  });

  const beat4 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Guild Heist Setup",
      description: "Plan the infiltration of a noble house's vault records.",
      beatType: BeatType.SIDE_QUEST,
      sequenceOrder: 4,
    },
  });

  const beat5 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Guild Heist Execution",
      description: "Pull off the heist and return to the main investigation.",
      beatType: BeatType.SIDE_QUEST,
      sequenceOrder: 5,
    },
  });

  const beat6 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Explore the Ashen Vault",
      description:
        "The party descends into ancient ruins searching for a magical artifact.",
      beatType: BeatType.BOSS,
      sequenceOrder: 6,
    },
  });

  const beat7 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Confront Lady Seraphine",
      description:
        "The party faces the royal advisor amid revelations of betrayal.",
      beatType: BeatType.DIALOGUE,
      sequenceOrder: 7,
    },
  });

  const beat8 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Seraphine's Ritual Chamber",
      description:
        "A hidden chamber reveals the true scope of the forbidden ritual.",
      beatType: BeatType.ENCOUNTER,
      sequenceOrder: 8,
    },
  });

  const beat9 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "The Hidden Catacombs",
      description: "A secret passage beneath the capital, known only to a few.",
      beatType: BeatType.SIDE_QUEST,
      sequenceOrder: 9,
    },
  });

  const beat10 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Catacombs Treasure",
      description:
        "Forgotten relics line the catacomb walls, guarded by old wards.",
      beatType: BeatType.SIDE_QUEST,
      sequenceOrder: 10,
    },
  });

  const beat11 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Rally the Council",
      description: "The fractured noble houses must be convinced to unite.",
      beatType: BeatType.DIALOGUE,
      sequenceOrder: 11,
    },
  });

  const beat12 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Defend Ebonreach",
      description: "The capital comes under siege as the conspiracy unravels.",
      beatType: BeatType.ENCOUNTER,
      sequenceOrder: 12,
    },
  });

  const beat13 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "Final March to the Crown",
      description:
        "The party advances on the source of the kingdom's collapse.",
      beatType: BeatType.MAIN_QUEST,
      sequenceOrder: 13,
    },
  });

  const beat14 = await prisma.storyBeat.create({
    data: {
      campaignId: campaign.id,
      title: "The Shattered Crown Reclaimed",
      description: "The kingdom's fate is sealed, for better or worse.",
      beatType: BeatType.ENDING,
      sequenceOrder: 14,
    },
  });

  // ======================================================
  // BEAT TRANSITIONS
  // ======================================================

  await prisma.beatTransition.createMany({
    data: [
      // Main spine: 1 -> 2
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat1.id,
        toBeatId: beat2.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription:
          "Players successfully gain audience with the council.",
        isHidden: false,
      },

      // Side branch off 2: 2 -> 3 -> 4 -> 5 -> 6 (rejoins main)
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat2.id,
        toBeatId: beat3.id,
        transitionType: TransitionType.OPTIONAL,
        conditionDescription:
          "Players seek out the Thieves' Guild instead of proceeding directly.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat3.id,
        toBeatId: beat4.id,
        transitionType: TransitionType.ACCEPT,
        conditionDescription: "Players accept the Guild's offer.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat4.id,
        toBeatId: beat5.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription: "Heist plan is finalized.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat5.id,
        toBeatId: beat6.id,
        transitionType: TransitionType.COMBAT_WIN,
        conditionDescription: "Heist succeeds, vault location confirmed.",
        isHidden: false,
      },

      // Direct main path, skipping the side quest: 2 -> 6
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat2.id,
        toBeatId: beat6.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription:
          "Players proceed directly to the vault without the Guild's help.",
        isHidden: false,
      },

      // Main spine: 6 -> 7
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat6.id,
        toBeatId: beat7.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription: "Vault artifact leads directly to Seraphine.",
        isHidden: false,
      },

      // Side branch off 7: 7 -> 8 (rejoins at 11)
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat7.id,
        toBeatId: beat8.id,
        transitionType: TransitionType.OPTIONAL,
        conditionDescription:
          "Players press Seraphine further about the ritual.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat8.id,
        toBeatId: beat11.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription:
          "Ritual chamber evidence strengthens the council's resolve.",
        isHidden: false,
      },

      // Hidden side branch off 7: 7 -> 9 -> 10 (rejoins at 11)
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat7.id,
        toBeatId: beat9.id,
        transitionType: TransitionType.SECRET,
        conditionDescription:
          "Players discover a hidden passage during the confrontation.",
        isHidden: true,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat9.id,
        toBeatId: beat10.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription: "Players navigate the catacombs successfully.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat10.id,
        toBeatId: beat11.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription:
          "Catacomb relics provide additional leverage with the council.",
        isHidden: false,
      },

      // Direct main path, skipping both side branches: 7 -> 11
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat7.id,
        toBeatId: beat11.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription:
          "Players proceed straight to rallying the council.",
        isHidden: false,
      },

      // Main spine: 11 -> 12 -> 13 -> 14
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat11.id,
        toBeatId: beat12.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription: "Council agrees to unite against the siege.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat12.id,
        toBeatId: beat13.id,
        transitionType: TransitionType.COMBAT_WIN,
        conditionDescription: "Ebonreach holds, party advances on the source.",
        isHidden: false,
      },
      {
        campaignId: activeCampaign.id,
        fromBeatId: beat13.id,
        toBeatId: beat14.id,
        transitionType: TransitionType.SUCCESS,
        conditionDescription: "The final confrontation concludes the campaign.",
        isHidden: false,
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
