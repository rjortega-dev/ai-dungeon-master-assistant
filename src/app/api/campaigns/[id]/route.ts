import { NextRequest, NextResponse } from "next/server";
import { getCampaignWorld } from "@/features/campaigns/api/get-active-campaign-world";


// GET /api/campaigns[id] - returns single campaign w all related items
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{id: string}> }
) {

    const { id } = await params;
    const campaign = await getCampaignWorld(id);

    if (!campaign) {
        return NextResponse.json(
            { error: "Campaign not found" },
            { status: 404 });
    }

    return NextResponse.json(campaign, {status: 200});
}