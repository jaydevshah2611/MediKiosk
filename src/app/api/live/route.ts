import { NextResponse } from "next/server";
import { getLiveStore, mergeLiveStore, patchLiveToken } from "@/lib/serverLiveStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getLiveStore());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = mergeLiveStore({
      tokens: Array.isArray(body.tokens) ? body.tokens : [],
      visits: Array.isArray(body.visits) ? body.visits : [],
      patients: Array.isArray(body.patients) ? body.patients : [],
    });
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ error: "Invalid live payload" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.tokenId) {
      return NextResponse.json({ error: "tokenId required" }, { status: 400 });
    }
    const store = patchLiveToken(body.tokenId, body.patch || { status: body.status });
    return NextResponse.json(store);
  } catch {
    return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  }
}
