import { NextRequest, NextResponse } from "next/server";
import { cancelSubscription, updateSubscription } from "@/app/actions/Stripe"; // adjust path

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;
    const { subscriptionId } = await req.json();

    if (!subscriptionId || !user_id) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
    }

    const result = await cancelSubscription(user_id, subscriptionId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params
    const { subscriptionId, newPriceId } = await req.json();
    if (!subscriptionId || !newPriceId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const result = await updateSubscription(user_id, subscriptionId, newPriceId);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Update subscription error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}