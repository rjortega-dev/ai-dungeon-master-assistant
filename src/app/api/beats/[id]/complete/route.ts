import { NextRequest, NextResponse } from "next/server";
import { completeBeat } from "@/features/campaigns/api/complete-beat";
import { uncompleteBeat } from "@/features/campaigns/api/uncomplete-beat";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let transitionId: string | undefined;
  try {
    const body = await request.json();
    transitionId = body?.transitionId;
  } catch {
    // No body / not JSON — fine, transitionId stays undefined.
  }

  const result = await completeBeat(id, transitionId);

  if (!result.success) {
    const status =
      result.error === "NOT_FOUND"
        ? 404
        : result.error === "ALREADY_COMPLETED"
          ? 409
          : 400;

    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result, { status: 200 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await uncompleteBeat(id);

  if (!result.success) {
    const status =
      result.error === "NOT_FOUND"
        ? 404
        : result.error === "NOT_COMPLETED"
          ? 409
          : 400; // DOWNSTREAM_COMPLETED

    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result, { status: 200 });
}
