import { NextRequest, NextResponse } from "next/server";
import { getCampaignBeats } from "@/features/campaigns/api/get-campaign-beats";

// GET /api/campaigns/[id]/beats — returns beats + transitions for the story beat graph
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const beats = await getCampaignBeats(id);

  if (!beats) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  return NextResponse.json({ campaignId: id, beats }, { status: 200 });
}
