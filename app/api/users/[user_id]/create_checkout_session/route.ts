import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/app/actions/Stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const body = await req.json();
    const { price_id } = body;

    if (!price_id || !user_id) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    const { url } = await createCheckoutSession(user_id, price_id);

    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
