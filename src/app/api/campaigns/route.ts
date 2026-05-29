import { NextRequest, NextResponse } from "next/server";

import { createCampaign } from "@/features/campaigns/api/create-campaign";
import { createCharacter } from "@/features/campaigns/api/create-character";
import { createCampaignCharacter } from "@/features/campaigns/api/create-campaign-character";
import { createLocation } from "@/features/campaigns/api/create-location";
import { createCampaignLocation } from "@/features/campaigns/api/create-campaign-location";
import { createStoryBeat } from "@/features/campaigns/api/create-story-beat";

import { prisma } from "@/lib/prisma/prisma";

// POST: /api/campaigns - create new campaign with character, locations, beats
// TODO: handling for incomplete campaign; creation failures
export async function POST(request: NextRequest) {
    const body = await request.json();

    // grab first user in db as placeholder
    const tempUser = await prisma.user.findFirst();
    if (!tempUser) {
        return NextResponse.json(
            { error: "No User Foudnd" },
            { status: 500}
        );
    }

    // campaign creation
    const campaign = await createCampaign({
        ownerUserId: tempUser.id,
        title: body.campaignName,
        settingSummary: body.world.settingName
    });

    // character creation
    for (const player of body.players) {
        const character = await createCharacter({
            creatorUserId: tempUser.id,
            name: player.characterName,
            class: player.characterClass,
            race: player.characterRace,
            isNpc: false,
        });

        // link character to campaign
        await createCampaignCharacter({
            campaignId: campaign.id,
            characterId: character.id,
            startingLevel: player.characterLevel,
            notes: player.notes,
        });
    }

    // location creation
    for (const location of body.world.locations) {
        const newLocation = await createLocation({
            creatorUserId: tempUser.id,
            name: location.name,
            description: location.description,
        });

        // link location to campaign
        await createCampaignLocation({
            campaignId: campaign.id,
            locationId: newLocation.id,
        });
    }

    // create campaign story beats
    // TODO: reconcile beat types to BeatType enum
    for (const beat of body.storyBeats) {
        await createStoryBeat({
            campaignId: campaign.id,
            title: beat.title,
            description: beat.notes,
            beatType: beat.type,
        });
    }

    return NextResponse.json(campaign, { status: 201 });
}

// GET /api/campaigns - return list of all campaigns
export async function GET() {
    const campaigns = await prisma.campaign.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return NextResponse.json(campaigns, { status: 200 });
}