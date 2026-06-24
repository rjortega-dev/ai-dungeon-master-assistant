import { NextRequest, NextResponse } from "next/server";
import { toggleBeatComplete } from "@/features/campaigns/api/toggle-beat-complete";

// PATCH /api/beats/[id]/complete — toggles completedAt on/off
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await toggleBeatComplete(id);

  if (!result.success) {
    return NextResponse.json(
      { error: "Story beat not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(result, { status: 200 });
}
