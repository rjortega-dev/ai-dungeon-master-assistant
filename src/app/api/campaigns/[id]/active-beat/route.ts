import { NextRequest, NextResponse } from "next/server";
import { setActiveBeat } from "@/features/campaigns/api/set-active-beat";

// PATCH /api/campaigns/[id]/active-beat — sets the campaign's active beat
// directly, without completing anything. Body: { beatId }.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: campaignId } = await params;

  let beatId: string | undefined;
  try {
    const body = await request.json();
    beatId = body?.beatId;
  } catch {
    // fall through to the missing-beatId check below
  }

  if (!beatId) {
    return NextResponse.json({ error: "beatId is required" }, { status: 400 });
  }

  const result = await setActiveBeat(beatId, campaignId);

  if (!result.success) {
    const status =
      result.error === "NOT_FOUND"
        ? 404
        : result.error === "ALREADY_COMPLETED"
          ? 409
          : result.error === "CAMPAIGN_MISMATCH"
            ? 400
            : 403; // HARD_FORECLOSED

    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result, { status: 200 });
}
