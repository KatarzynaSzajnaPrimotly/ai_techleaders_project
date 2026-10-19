import { NextResponse } from "next/server";
import { MentorAlreadyExistsError, MentorValidationError } from "@devmentor/core";
import { createRequestScope } from "../../../server/container";

export const dynamic = "force-dynamic";

export async function GET() {
  const { cradle } = await createRequestScope();
  return NextResponse.json(await cradle.mentorService.list());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }
  const { cradle } = await createRequestScope();
  try {
    return NextResponse.json(await cradle.mentorService.register(body), { status: 201 });
  } catch (error) {
    if (error instanceof MentorValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof MentorAlreadyExistsError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
