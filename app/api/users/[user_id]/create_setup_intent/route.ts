import { NextRequest, NextResponse } from "next/server";
import { createSetupIntent } from "@/app/actions/Stripe"; // Adjust import path if needed

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    if (!user_id) {
      return NextResponse.json({ success: false, error: "Missing user ID" }, { status: 400 });
    }

    const result = await createSetupIntent(user_id);

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("Error in setup intent route:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
