import { NextRequest, NextResponse } from "next/server";
import { createBeatAndAdvance } from "@/features/campaigns/api/create-beat-and-advance";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: {
    title?: string;
    description?: string;
    isMainContinuation?: boolean;
  } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
  }

  if (!body.title) {
    return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
  }

  const result = await createBeatAndAdvance(id, {
    title: body.title,
    description: body.description,
    isMainContinuation: body.isMainContinuation ?? true,
  });

  if (!result.success) {
    const status =
      result.error === "NOT_FOUND"
        ? 404
        : result.error === "ALREADY_COMPLETED"
          ? 409
          : 400; // TITLE_REQUIRED

    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result, { status: 201 });
}
